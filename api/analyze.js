// Función de servidor de Vercel: recibe un paso del análisis, arma el prompt
// y llama a Claude a través de Vercel AI Gateway. La clave nunca llega al navegador.
import { SYSTEM, buildPrompt } from '../server/prompts.js';

const GATEWAY_URL = 'https://ai-gateway.vercel.sh/v1/messages';
const MODEL = process.env.D360_MODEL || 'anthropic/claude-sonnet-5';

function errorMessage(status, data) {
  if (status === 401 || status === 403) {
    return 'La clave de AI Gateway no es válida o no tiene permisos. Revisa la variable AI_GATEWAY_API_KEY en Vercel y vuelve a desplegar.';
  }
  if (status === 402) {
    return 'Se agotaron los créditos de AI Gateway. Revisa el saldo en tu panel de Vercel.';
  }
  if (status === 429) {
    return 'Hay demasiadas solicitudes o se agotaron los créditos de AI Gateway. Espera un minuto e inténtalo de nuevo.';
  }
  const detail = data && data.error && (data.error.message || data.error);
  return `El modelo devolvió un error (código ${status}). ${detail ? String(detail).slice(0, 200) : ''}`.trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const spec = buildPrompt(body.step, body.payload);
  if (!spec) {
    return res.status(400).json({ error: 'Solicitud de análisis incompleta o no reconocida.' });
  }

  const key = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN || req.headers['x-vercel-oidc-token'];
  if (!key) {
    return res.status(500).json({
      error: 'Falta configurar la variable AI_GATEWAY_API_KEY en Vercel (Settings → Environment Variables) y volver a desplegar.',
    });
  }

  try {
    const r = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'anthropic-version': '2023-06-01',
        authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: spec.maxTokens,
        system: SYSTEM,
        messages: [{ role: 'user', content: spec.content }],
      }),
    });

    let data = null;
    try { data = await r.json(); } catch { data = null; }

    if (!r.ok) {
      return res.status(502).json({ error: errorMessage(r.status, data) });
    }

    const text = (Array.isArray(data && data.content) ? data.content : [])
      .filter((b) => b && b.type === 'text')
      .map((b) => b.text)
      .join('\n');

    return res.status(200).json({ text });
  } catch {
    return res.status(502).json({ error: 'No se pudo conectar con el modelo. Inténtalo de nuevo en unos minutos.' });
  }
}
