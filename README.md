# Decisión 360° · FuturIA (versión académica)

Aplicación para poner a prueba decisiones de estrategia digital (pauta, contenido orgánico y canales de venta) antes de ejecutarlas.

## Cómo funciona
- `src/`: la interfaz (React + Vite).
- `api/analyze.js`: función de servidor de Vercel que llama a Claude a través de Vercel AI Gateway. La clave nunca llega al navegador.
- `api/url.js`: función de servidor que lee el texto público de los sitios web que cargues como contexto.
- `server/prompts.js`: los prompts del análisis estratégico.

## Publicar en Vercel
1. Sube esta carpeta a un repositorio de GitHub.
2. En Vercel: Add New → Project → importa el repositorio. Vercel detecta Vite solo.
3. Crea una clave en AI Gateway → API Keys y agrégala como variable de entorno `AI_GATEWAY_API_KEY`.
4. Deploy. Si agregas la variable después, vuelve a desplegar.

Opcional: la variable `D360_MODEL` cambia el modelo (por defecto `anthropic/claude-sonnet-5`).

## Datos
Los ejemplos usan datos simulados de una empresa de mariscos. El historial y los pesos se guardan solo en el navegador de cada persona.
