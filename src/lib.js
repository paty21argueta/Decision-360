// Utilidades: normalización de resultados, puntaje ponderado y exportaciones.

export const DIMS = [
  { key: 'financiero', label: 'Financiero' },
  { key: 'estrategico', label: 'Estratégico' },
  { key: 'operacional', label: 'Operacional' },
  { key: 'reputacional', label: 'Reputacional' },
  { key: 'riesgo', label: 'Riesgo controlado' },
  { key: 'humano', label: 'Capital humano' },
];

export const DEFAULT_WEIGHTS = {
  financiero: 25,
  estrategico: 20,
  operacional: 15,
  reputacional: 15,
  riesgo: 15,
  humano: 10,
};

export const EXEC_V = ['Avanzar', 'Avanzar con ajustes', 'Reconsiderar', 'Detener'];
export const EXP_V = ['Avanzar', 'Ajustar', 'Detener'];
export const ST_V = ['Gana', 'Pierde', 'Bloquea', 'Neutral'];
export const EV_T = ['Hecho', 'Inferencia', 'Supuesto'];
export const ROLES = [
  'CFO',
  'Estratega',
  'Director de Riesgos',
  'Asesor Legal',
  'Economista Conductual',
  'Director de Operaciones',
  'Voz del Mercado',
];
const ESC_NAMES = ['Optimista', 'Base', 'Pesimista'];

export function txt(v, d = '') {
  if (typeof v === 'string') return v.trim();
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return v.map((x) => txt(x)).filter(Boolean).join('; ');
  if (v && typeof v === 'object') return Object.values(v).map((x) => txt(x)).filter(Boolean).join(' ');
  return d;
}

export function num(v, min, max, d) {
  const n = Number(v);
  if (!Number.isFinite(n)) return d;
  return Math.min(max, Math.max(min, Math.round(n)));
}

const arr = (v) => (Array.isArray(v) ? v : []);

function pick(v, list, d) {
  const s = txt(v).toLowerCase();
  const found = list.find((x) => x.toLowerCase() === s);
  return found || d;
}

function strList(v, max) {
  return arr(v).map((x) => txt(x)).filter(Boolean).slice(0, max);
}

function consecuenciasText(v) {
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    const parts = [];
    if (v.primerOrden) parts.push('Primer orden: ' + txt(v.primerOrden));
    if (v.segundoOrden) parts.push('Segundo orden: ' + txt(v.segundoOrden));
    if (v.tercerOrden) parts.push('Tercer orden: ' + txt(v.tercerOrden));
    return parts.length ? parts.join('\n') : txt(v);
  }
  return txt(v);
}

function roleKey(rol) {
  const words = rol.toLowerCase().split(' ');
  return words[words.length - 1];
}

export function normalize(raw) {
  const r = raw && typeof raw === 'object' ? raw : {};

  const dimsIn = r.dimensiones && typeof r.dimensiones === 'object' ? r.dimensiones : null;
  const dimensiones = {};
  DIMS.forEach((d) => {
    dimensiones[d.key] = num(dimsIn ? dimsIn[d.key] : undefined, 0, 100, 50);
  });

  const expIn = arr(r.expertos).filter((e) => e && typeof e === 'object');
  const expertos = expIn.length
    ? ROLES.map((rol, i) => {
        const key = roleKey(rol);
        const e = expIn.find((x) => txt(x.rol).toLowerCase().includes(key)) || expIn[i] || null;
        if (!e) {
          return { rol, veredicto: 'Ajustar', score: 50, preocupacion: 'Sin respuesta de esta perspectiva.', recomendacion: 'No informado', faltante: true };
        }
        return {
          rol,
          veredicto: pick(e.veredicto, EXP_V, 'Ajustar'),
          score: num(e.score, 0, 100, 50),
          preocupacion: txt(e.preocupacion, 'No informado') || 'No informado',
          recomendacion: txt(e.recomendacion, 'No informado') || 'No informado',
        };
      })
    : [];

  const escIn = arr(r.escenarios).filter((e) => e && typeof e === 'object');
  const escenarios = escIn.length
    ? ESC_NAMES.map((nombre, i) => {
        const e = escIn.find((x) => txt(x.nombre).toLowerCase() === nombre.toLowerCase()) || escIn[i] || {};
        return {
          nombre,
          probabilidad: num(e.probabilidad, 0, 100, 33),
          impacto: num(e.impacto, -100, 100, 0),
          narrativa: txt(e.narrativa, 'No informado') || 'No informado',
        };
      })
    : [];

  const stakeholders = arr(r.stakeholders)
    .filter((s) => s && typeof s === 'object' && txt(s.nombre))
    .slice(0, 6)
    .map((s) => ({
      nombre: txt(s.nombre),
      postura: pick(s.postura, ST_V, 'Neutral'),
      poder: num(s.poder, 0, 100, 50),
      interes: num(s.interes, 0, 100, 50),
    }));

  const evidencias = arr(r.evidencias)
    .filter((e) => e && typeof e === 'object' && txt(e.afirmacion))
    .slice(0, 10)
    .map((e) => ({
      afirmacion: txt(e.afirmacion),
      tipo: pick(e.tipo, EV_T, 'Supuesto'),
      fuente: txt(e.fuente) || 'Sin respaldo',
      fragmento: txt(e.fragmento),
    }));

  const nivelesIn = r.niveles && typeof r.niveles === 'object' ? r.niveles : {};
  const veredicto = EXEC_V.includes(txt(r.veredicto)) ? txt(r.veredicto) : pick(r.veredicto, EXEC_V, 'Sin veredicto');

  return {
    decision: txt(r.decision, 'No informado') || 'No informado',
    objetivo: txt(r.objetivo, 'No informado') || 'No informado',
    contexto: txt(r.contexto, 'No informado') || 'No informado',
    preguntaSuperior: txt(r.preguntaSuperior),
    nivel: txt(r.nivel),
    alternativas: strList(r.alternativas, 7),
    queTendriaQueSerCierto: strList(r.queTendriaQueSerCierto, 6),
    costoOportunidad: txt(r.costoOportunidad),
    veredicto,
    confianza: num(r.confianza, 0, 100, 0),
    sintesis: txt(r.sintesis),
    factores: strList(r.factores, 3),
    proximosPasos: strList(r.proximosPasos, 3),
    niveles: {
      operativo: txt(nivelesIn.operativo),
      estrategico: txt(nivelesIn.estrategico),
      transformacional: txt(nivelesIn.transformacional),
    },
    preMortem: txt(r.preMortem),
    argumentoContrario: txt(r.argumentoContrario),
    consecuencias: consecuenciasText(r.consecuencias),
    noEstamosViendo: strList(r.noEstamosViendo, 5),
    dimensiones,
    expertos,
    escenarios,
    stakeholders,
    evidencias,
    contextoNivel: txt(r.contextoNivel, 'Sin contexto') || 'Sin contexto',
    ctxEjemplo: r.ctxEjemplo && typeof r.ctxEjemplo === 'object' ? r.ctxEjemplo : null,
    esEjemplo: Boolean(r.esEjemplo),
    modulosFallidos: num(r.modulosFallidos, 0, 10, 0),
    createdAt: num(r.createdAt, 0, 9e15, Date.now()),
  };
}

export function sanitizeHistory(list) {
  return arr(list)
    .filter((x) => x && typeof x === 'object' && x.data && typeof x.data === 'object')
    .slice(0, 20)
    .map((x, i) => ({
      id: txt(x.id) || `h-${Date.now()}-${i}`,
      decision: txt(x.decision) || 'Decisión sin título',
      veredicto: txt(x.veredicto) || 'Sin veredicto',
      confianza: num(x.confianza, 0, 100, 0),
      createdAt: num(x.createdAt, 0, 9e15, Date.now()),
      data: x.data,
    }));
}

export function sanitizeWeights(w) {
  const out = {};
  DIMS.forEach((d) => {
    out[d.key] = num(w && w[d.key], 0, 100, DEFAULT_WEIGHTS[d.key]);
  });
  return out;
}

export function weighted(dims, weights) {
  const total = DIMS.reduce((a, d) => a + (weights[d.key] || 0), 0);
  if (!total) {
    return Math.round(DIMS.reduce((a, d) => a + dims[d.key], 0) / DIMS.length);
  }
  return Math.round(DIMS.reduce((a, d) => a + dims[d.key] * (weights[d.key] || 0), 0) / total);
}

export function weightPct(weights, key) {
  const total = DIMS.reduce((a, d) => a + (weights[d.key] || 0), 0);
  return total ? Math.round(((weights[key] || 0) / total) * 100) : 0;
}

export function fmtDate(ms) {
  try {
    return new Date(ms).toLocaleString('es-GT', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return '';
  }
}

function stamp() {
  return new Date().toISOString().slice(0, 10);
}

function download(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportTxt(r, weights) {
  const L = [];
  const line = '-'.repeat(48);
  L.push('DECISIÓN 360° · FuturIA', line);
  if (r.esEjemplo) L.push('Ejemplo con datos simulados.', '');
  L.push('Decisión: ' + r.decision);
  L.push('Objetivo: ' + r.objetivo);
  L.push('Contexto: ' + r.contexto);
  L.push('Fecha: ' + fmtDate(r.createdAt), '');
  L.push('Veredicto: ' + r.veredicto);
  L.push('Confianza analítica: ' + r.confianza + '% (no es probabilidad de éxito)');
  L.push('Puntaje ponderado con tus pesos: ' + weighted(r.dimensiones, weights) + '/100', '');
  L.push('SÍNTESIS', line, r.sintesis || 'No informado', '');
  if (r.preguntaSuperior) L.push('Pregunta de fondo: ' + r.preguntaSuperior, '');
  L.push('FACTORES DECISIVOS', line);
  r.factores.forEach((f, i) => L.push(`${i + 1}. ${f}`));
  L.push('', 'PRÓXIMOS PASOS', line);
  r.proximosPasos.forEach((p, i) => L.push(`${i + 1}. ${p}`));
  if (r.alternativas.length) {
    L.push('', 'ALTERNATIVAS CONSIDERADAS', line);
    r.alternativas.forEach((a) => L.push('- ' + a));
  }
  if (r.queTendriaQueSerCierto.length) {
    L.push('', 'QUÉ TENDRÍA QUE SER CIERTO', line);
    r.queTendriaQueSerCierto.forEach((a) => L.push('- ' + a));
  }
  if (r.costoOportunidad) L.push('', 'Costo de oportunidad: ' + r.costoOportunidad);
  L.push('', 'PANEL DE EXPERTOS', line);
  r.expertos.forEach((e) => {
    L.push(`${e.rol}: ${e.veredicto} (${e.score}/100)`);
    L.push('  Preocupación: ' + e.preocupacion);
    L.push('  Recomendación: ' + e.recomendacion);
  });
  L.push('', 'ESCENARIOS (estimaciones, no probabilidades estadísticas)', line);
  r.escenarios.forEach((e) => {
    L.push(`${e.nombre}: probabilidad aprox. ${e.probabilidad}%, impacto ${e.impacto}`);
    L.push('  ' + e.narrativa);
  });
  L.push('', 'STAKEHOLDERS', line);
  r.stakeholders.forEach((s) => L.push(`${s.nombre}: ${s.postura} (poder ${s.poder}, interés ${s.interes})`));
  L.push('', 'IMPACTO POR DIMENSIÓN (0 desfavorable, 50 neutral, 100 favorable)', line);
  DIMS.forEach((d) => L.push(`${d.label}: ${r.dimensiones[d.key]} (peso ${weightPct(weights, d.key)}%)`));
  L.push('', 'PRE-MORTEM', line, r.preMortem || 'No informado');
  L.push('', 'ARGUMENTO CONTRARIO', line, r.argumentoContrario || 'No informado');
  L.push('', 'CONSECUENCIAS', line, r.consecuencias || 'No informado');
  if (r.evidencias.length) {
    L.push('', 'HECHOS, INFERENCIAS Y SUPUESTOS', line);
    r.evidencias.forEach((e) => {
      L.push(`[${e.tipo}] ${e.afirmacion}`);
      L.push(`  Fuente: ${e.fuente}${e.fragmento ? ` · "${e.fragmento}"` : ''}`);
    });
  }
  L.push('', line, 'El análisis apoya la decisión; no reemplaza el juicio de quien decide.');
  download(L.join('\n'), `decision-360-${stamp()}.txt`, 'text/plain;charset=utf-8');
}

const q = (v) => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;

export function exportCsv(r, weights) {
  const rows = [];
  rows.push([q('Decisión'), q(r.decision)].join(','));
  rows.push([q('Veredicto'), q(r.veredicto)].join(','));
  rows.push([q('Confianza analítica (%)'), q(r.confianza)].join(','));
  rows.push([q('Puntaje ponderado'), q(weighted(r.dimensiones, weights))].join(','));
  rows.push('');
  rows.push(q('EXPERTOS'));
  rows.push(['Rol', 'Veredicto', 'Score', 'Preocupación', 'Recomendación'].map(q).join(','));
  r.expertos.forEach((e) => rows.push([e.rol, e.veredicto, e.score, e.preocupacion, e.recomendacion].map(q).join(',')));
  rows.push('');
  rows.push(q('ESCENARIOS'));
  rows.push(['Escenario', 'Probabilidad aprox. (%)', 'Impacto (-100 a 100)', 'Narrativa'].map(q).join(','));
  r.escenarios.forEach((e) => rows.push([e.nombre, e.probabilidad, e.impacto, e.narrativa].map(q).join(',')));
  rows.push('');
  rows.push(q('STAKEHOLDERS'));
  rows.push(['Nombre', 'Postura', 'Poder', 'Interés'].map(q).join(','));
  r.stakeholders.forEach((s) => rows.push([s.nombre, s.postura, s.poder, s.interes].map(q).join(',')));
  rows.push('');
  rows.push(q('DIMENSIONES'));
  rows.push(['Dimensión', 'Valor (0-100)', 'Peso (%)'].map(q).join(','));
  DIMS.forEach((d) => rows.push([d.label, r.dimensiones[d.key], weightPct(weights, d.key)].map(q).join(',')));
  rows.push('');
  rows.push(q('EVIDENCIA'));
  rows.push(['Tipo', 'Afirmación', 'Fuente', 'Fragmento'].map(q).join(','));
  r.evidencias.forEach((e) => rows.push([e.tipo, e.afirmacion, e.fuente, e.fragmento].map(q).join(',')));
  download('\uFEFF' + rows.join('\n'), `decision-360-${stamp()}.csv`, 'text/csv;charset=utf-8');
}
