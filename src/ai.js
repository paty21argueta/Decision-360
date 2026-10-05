// Capa de IA del navegador. Solo habla con las funciones de servidor de esta app
// (/api/analyze y /api/url). Ninguna clave vive aquí.
import { normalize } from './lib.js';

export class ApiError extends Error {}

export async function ask(step, payload) {
  let res;
  try {
    res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ step, payload }),
    });
  } catch {
    throw new ApiError('No hay conexión con el servidor de la aplicación. Revisa tu internet e inténtalo de nuevo.');
  }
  let data = null;
  try { data = await res.json(); } catch { data = null; }
  if (!res.ok) {
    if (res.status === 404) {
      throw new ApiError('El servidor de análisis no está disponible en esta versión. Publica la aplicación en Vercel para usar el análisis con IA.');
    }
    throw new ApiError((data && data.error) || `El servidor respondió con un error (${res.status}).`);
  }
  return (data && data.text) || '';
}

export function extractJson(text) {
  if (!text) return null;
  const clean = String(text).replace(/```json|```/gi, '').trim();
  const start = clean.search(/[[{]/);
  if (start < 0) return null;
  const open = clean[start];
  const close = open === '{' ? '}' : ']';
  const end = clean.lastIndexOf(close);
  if (end <= start) return null;
  try {
    return JSON.parse(clean.slice(start, end + 1));
  } catch {
    return null;
  }
}

export async function safeAsk(step, payload, fallback) {
  try {
    const t = await ask(step, payload);
    const j = extractJson(t);
    if (j && typeof j === 'object') return { ok: true, data: j };
    return { ok: false, data: fallback };
  } catch (e) {
    return { ok: false, data: fallback, error: e && e.message };
  }
}

export async function fetchUrl(url) {
  try {
    const res = await fetch('/api/url', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const data = await res.json().catch(() => null);
    if (data && data.ok) return { url, ok: true, text: data.text };
    return { url, ok: false, error: (data && data.error) || 'No se pudo leer el sitio.' };
  } catch {
    return { url, ok: false, error: 'No se pudo leer el sitio.' };
  }
}

function readAsText(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ''));
    r.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    r.readAsText(file);
  });
}

function readAsBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || '').split(',')[1] || '');
    r.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    r.readAsDataURL(file);
  });
}

export async function summarizePdf(name, b64) {
  const text = await ask('pdf', { name, b64 });
  if (!text.trim()) throw new ApiError('El PDF no devolvió texto legible. Prueba copiando su contenido en un archivo TXT.');
  return text.trim();
}

export async function readFileForCtx(file) {
  const name = file.name || 'documento';
  const lower = name.toLowerCase();
  if (lower.endsWith('.txt') || lower.endsWith('.csv') || lower.endsWith('.md')) {
    const content = (await readAsText(file)).trim().slice(0, 15000);
    if (!content) throw new Error('El archivo está vacío.');
    return { name, content };
  }
  if (lower.endsWith('.pdf')) {
    if (file.size > 3 * 1024 * 1024) {
      throw new Error('El PDF pesa más de 3 MB. Usa una versión más liviana o copia su texto en un archivo TXT.');
    }
    const b64 = await readAsBase64(file);
    const content = await summarizePdf(name, b64);
    return { name, content };
  }
  throw new Error('Formato no soportado. Usa PDF, TXT o CSV.');
}

export function buildCtxBlock({ empresa, mercado, docs, web }) {
  const parts = [];
  if (empresa.trim()) parts.push('[EMPRESA]\n' + empresa.trim());
  if (mercado.trim()) parts.push('[MERCADO]\n' + mercado.trim());
  docs.forEach((d) => parts.push(`[DOCUMENTO: ${d.name}]\n${d.content}`));
  web.forEach((w) => parts.push(`[SITIO: ${w.url}]\n${w.text}`));
  return parts.join('\n\n');
}

const STAGES = [
  'Cuestionando los supuestos...',
  'Simulando escenarios...',
  'Consultando al panel de expertos...',
  'Evaluando stakeholders...',
  'Separando hechos de supuestos...',
];

export async function runAnalysis({ input, ctx }, onStage) {
  onStage('Clarificando la decisión...');
  // Si esta primera llamada falla por configuración o conexión, se detiene con un mensaje claro.
  const clarText = await ask('clarify', { input, ctx });
  const clar = extractJson(clarText) || { decision: input.slice(0, 200), objetivo: 'No informado', contexto: 'No informado' };

  const payload = { input, ctx, clar };
  let i = 0;
  onStage(STAGES[0]);
  const timer = setInterval(() => {
    i = (i + 1) % STAGES.length;
    onStage(STAGES[i]);
  }, 3500);

  let parts;
  try {
    parts = await Promise.all([
      safeAsk('critico', payload, {}),
      safeAsk('impacto', payload, {}),
      safeAsk('escenarios', payload, {}),
      safeAsk('panel', payload, {}),
      safeAsk('evidencia', payload, {}),
    ]);
  } finally {
    clearInterval(timer);
  }
  const [crit, imp, esc, pan, evi] = parts;

  onStage('Construyendo el reporte ejecutivo...');
  const modulos = {
    critico: crit.data,
    dimensiones: imp.data.dimensiones,
    stakeholders: imp.data.stakeholders,
    escenarios: esc.data.escenarios,
    expertos: pan.data.expertos,
    evidencias: evi.data.evidencias,
  };
  const sin = await safeAsk('sintesis', { ...payload, modulos }, {});

  const all = [crit, imp, esc, pan, evi, sin];
  const failed = all.filter((x) => !x.ok).length;
  if (failed === all.length) {
    const firstError = all.find((x) => x.error);
    throw new ApiError((firstError && firstError.error) || 'El modelo no devolvió un análisis válido. Inténtalo de nuevo.');
  }

  return normalize({
    ...clar,
    ...crit.data,
    ...imp.data,
    ...esc.data,
    ...pan.data,
    ...evi.data,
    ...sin.data,
    modulosFallidos: failed,
    createdAt: Date.now(),
  });
}
