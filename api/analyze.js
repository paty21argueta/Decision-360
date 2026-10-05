// Función de servidor de Vercel: recibe un paso del análisis, arma el prompt
// y llama a Claude a través de Vercel AI Gateway. La clave nunca llega al navegador.
import { SYSTEM, buildPrompt } from '../server/prompts.js';

const GATEWAY_URL = 'https://ai-gateway.vercel.sh/v1/messages';
const MODEL = process.env.D360_MODEL || 'anthropic/claude-sonnet-5';

function errorMessage(status, data) {
  const err = (data && data.error) || {};
  const type = String(err.type || err.code || '');
  const msg = String(err.message || (typeof data?.error === 'string' ? data.error : '') || '');
  const detail = msg ? ` Detalle de Vercel: "${msg.slice(0, 220)}"` : '';

  if (type === 'customer_verification_required' || /credit card|payment method/i.test(msg)) {
    return 'Vercel pide una tarjeta registrada para activar los créditos gratuitos de AI Gateway. Agrégala en Settings → Billing de tu cuenta de Vercel y vuelve a intentar (no se cobra mientras uses los créditos gratuitos).' + detail;
  }
  if (/free tier|free credits/i.test(msg)) {
    return 'El modelo configurado no está incluido en el plan gratuito de AI Gateway. Cambia la variable D360_MODEL por un modelo gratuito o compra créditos de AI Gateway.' + detail;
  }
  if (status === 401) {
    return 'La clave de AI Gateway no es válida, se borró o no se cargó. Revisa la variable AI_GATEWAY_API_KEY (que aplique a Production) y vuelve a desplegar.' + detail;
  }
  if (status === 403) {
    return 'AI Gateway rechazó la solicitud por permisos de la cuenta.' + detail;
  }
  if (status === 402) {
    return 'Se agotaron los créditos de AI Gateway. Revisa el saldo en tu panel de Vercel.';
  }
  if (status === 429) {
    return 'Hay demasiadas solicitudes o se agotaron los créditos de AI Gateway. Espera un minuto e inténtalo de nuevo.';
  }
  return `El modelo devolvió un error (código ${status}).${detail}`.trim();
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
      console.error('AI Gateway error', r.status, JSON.stringify(data).slice(0, 500));
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
