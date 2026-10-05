// Función de servidor de Vercel: lee el texto público de un sitio web
// para sumarlo como contexto. No guarda nada.
const MAX_CHARS = 4000;

function strip(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Método no permitido.' });
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  let target;
  try {
    target = new URL(String(body.url || '').trim());
  } catch {
    return res.status(400).json({ ok: false, error: 'La dirección web no es válida.' });
  }
  if (target.protocol !== 'http:' && target.protocol !== 'https:') {
    return res.status(400).json({ ok: false, error: 'Solo se aceptan direcciones http o https.' });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const r = await fetch(target, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; Decision360/1.0)',
        accept: 'text/html,text/plain',
      },
    });
    if (!r.ok) {
      return res.status(200).json({ ok: false, error: `El sitio respondió con código ${r.status}.` });
    }
    const type = r.headers.get('content-type') || '';
    if (!/text\/html|text\/plain/i.test(type)) {
      return res.status(200).json({ ok: false, error: 'El enlace no apunta a una página de texto.' });
    }
    const raw = (await r.text()).slice(0, 600000);
    const titleMatch = raw.match(/<title[^>]*>([^<]*)<\/title>/i);
    const text = strip(raw).slice(0, MAX_CHARS);
    if (!text) {
      return res.status(200).json({ ok: false, error: 'La página no tiene texto legible.' });
    }
    return res.status(200).json({ ok: true, title: titleMatch ? titleMatch[1].trim() : '', text });
  } catch {
    return res.status(200).json({ ok: false, error: 'No se pudo leer el sitio: tardó demasiado o bloquea lecturas automáticas.' });
  } finally {
    clearTimeout(timer);
  }
}
