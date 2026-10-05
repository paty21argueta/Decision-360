// Prompts internos de Decisión 360°.
// Viven en el servidor: el navegador solo envía la decisión y el contexto,
// así nadie puede usar la función para otra cosa que este análisis.

export const SYSTEM = `Eres el motor analítico de Decisión 360°, una herramienta que ayuda a líderes a poner a prueba una decisión antes de ejecutarla.
Tu trabajo NO es validar la propuesta: es cuestionar el framing, explorar alternativas, exponer supuestos, costo de oportunidad y consecuencias de segundo y tercer orden.

Reglas obligatorias:
1. Responde SOLO con JSON válido. Sin Markdown, sin backticks, sin texto antes ni después.
2. Escribe en español profesional, claro y directo. Nada académico ni grandilocuente.
3. No inventes datos, cifras ni hechos que no estén en la decisión o en el contexto. Si falta información, dilo de forma explícita y trabaja con supuestos marcados como tales.
4. Diferencia hechos (lo que dice el texto del usuario) de inferencias (lo que tú concluyes).
5. Evita la falsa precisión: puntajes, probabilidades y confianza son estimaciones analíticas aproximadas, no mediciones.
6. Usa "El análisis sugiere..."; nunca "debes...". La herramienta apoya la decisión, no la reemplaza.`;

const clip = (v, n) => String(v == null ? '' : v).slice(0, n);

function base(p) {
  const ctx = clip(p.ctx, 30000).trim();
  return `DECISIÓN DESCRITA POR EL USUARIO:
${clip(p.input, 6000)}

CONTEXTO CARGADO POR EL USUARIO (las etiquetas entre corchetes indican la fuente):
${ctx || 'Sin contexto adicional.'}`;
}

function clar(p) {
  if (!p.clar) return '';
  return `\n\nCLARIFICACIÓN Y REENCUADRE YA HECHOS:\n${clip(JSON.stringify(p.clar), 5000)}`;
}

const STEPS = {
  clarify: (p) => ({
    maxTokens: 1400,
    text: `${base(p)}

Tarea: clarifica la decisión y reencuádrala antes de analizarla.
Evalúa: cuál es la decisión explícita, cuál es el problema subyacente, qué objetivo superior podría existir, si se está optimizando una solución prematuramente, qué alternativas deberían considerarse, en qué nivel está la decisión y qué tendría que ser cierto para que funcione.

Devuelve exactamente este JSON:
{
  "decision": "la decisión en una frase clara, sin inventar información",
  "objetivo": "el objetivo principal; si no aparece, escribe 'No informado'",
  "contexto": "resumen breve del contexto relevante usando solo lo que aparece en la entrada; si no hay, 'No informado'",
  "preguntaSuperior": "una pregunta estratégica de mayor nivel que la decisión planteada",
  "nivel": "Operativo | Táctico | Estratégico | Transformacional",
  "alternativas": ["entre 3 y 6 caminos realmente distintos, incluida la propuesta original y la opción de no hacer nada o posponer"],
  "queTendriaQueSerCierto": ["entre 3 y 5 condiciones críticas para que la decisión funcione"],
  "costoOportunidad": "qué otra oportunidad se deja de perseguir al asignar capital, tiempo, talento y atención a esta decisión"
}`,
  }),

  critico: (p) => ({
    maxTokens: 1800,
    text: `${base(p)}${clar(p)}

Tarea: bloque crítico.
- Pre-mortem: imagina que pasaron 12 a 24 meses y la decisión fracasó claramente. Reconstruye las causas probables.
- Argumento contrario: el MEJOR argumento razonable contra la propuesta. Nada de strawman débil.
- Consecuencias de primer, segundo y tercer orden, incluidos efectos no obvios.
- Responde brevemente las cinco preguntas de "¿Qué no estamos viendo?", en este orden: qué supuestos damos por ciertos; qué podría invalidar todo el análisis; qué cambio externo haría fracasar la decisión; qué haría un competidor excepcionalmente inteligente; qué decisión podríamos lamentar dentro de cinco años.

Devuelve exactamente este JSON:
{
  "preMortem": "un párrafo",
  "argumentoContrario": "un párrafo",
  "consecuencias": "Primer orden: ...\\nSegundo orden: ...\\nTercer orden: ...",
  "noEstamosViendo": ["respuesta 1", "respuesta 2", "respuesta 3", "respuesta 4", "respuesta 5"]
}`,
  }),

  impacto: (p) => ({
    maxTokens: 1400,
    text: `${base(p)}${clar(p)}

Tarea: stakeholders e impacto multidimensional.
- Identifica entre 4 y 6 stakeholders reales para esta decisión. Postura: "Gana", "Pierde", "Bloquea" o "Neutral". Poder e interés de 0 a 100.
- Evalúa seis dimensiones de 0 a 100, donde 0 es muy desfavorable, 50 neutral y 100 muy favorable. En "riesgo", 100 significa riesgo altamente controlado y 0 riesgo severo.

Devuelve exactamente este JSON:
{
  "stakeholders": [{"nombre": "", "postura": "Gana|Pierde|Bloquea|Neutral", "poder": 0, "interes": 0}],
  "dimensiones": {"financiero": 0, "estrategico": 0, "operacional": 0, "reputacional": 0, "riesgo": 0, "humano": 0}
}`,
  }),

  escenarios: (p) => ({
    maxTokens: 1200,
    text: `${base(p)}${clar(p)}

Tarea: tres escenarios, exactamente "Optimista", "Base" y "Pesimista".
- Probabilidades aproximadas que sumen 100, en números redondos (múltiplos de 5).
- Impacto de -100 a +100 (dirección y magnitud estimadas, no una cifra financiera).
- Narrativa de 2 a 3 frases por escenario.

Devuelve exactamente este JSON:
{
  "escenarios": [
    {"nombre": "Optimista", "probabilidad": 0, "impacto": 0, "narrativa": ""},
    {"nombre": "Base", "probabilidad": 0, "impacto": 0, "narrativa": ""},
    {"nombre": "Pesimista", "probabilidad": 0, "impacto": 0, "narrativa": ""}
  ]
}`,
  }),

  panel: (p) => ({
    maxTokens: 2200,
    text: `${base(p)}${clar(p)}

Actúa como un comité ejecutivo multidisciplinario. Evalúa de forma independiente las perspectivas de:
1. CFO
2. Estratega
3. Director de Riesgos
4. Asesor Legal
5. Economista Conductual
6. Director de Operaciones
7. Voz del Mercado

No fuerces consenso: el objetivo es exponer desacuerdos útiles. Cada especialista piensa desde su disciplina y considera alternativas, costo de oportunidad, supuestos, qué tendría que ser cierto y consecuencias de segundo orden.
Veredicto de cada uno: "Avanzar", "Ajustar" o "Detener". Score de 0 a 100 (qué tan favorable ve la decisión).

Devuelve exactamente este JSON, con los siete roles en ese orden:
{
  "expertos": [{"rol": "CFO", "veredicto": "Avanzar|Ajustar|Detener", "score": 0, "preocupacion": "una o dos frases", "recomendacion": "una o dos frases"}]
}`,
  }),

  evidencia: (p) => ({
    maxTokens: 1800,
    text: `${base(p)}${clar(p)}

Tarea: separa hechos, inferencias y supuestos, con trazabilidad.
Lista entre 5 y 8 afirmaciones clave sobre las que descansa esta decisión:
- "Hecho": aparece explícitamente en la decisión o en el contexto.
- "Inferencia": una conclusión razonable que se apoya en un fragmento concreto.
- "Supuesto": algo que la decisión da por cierto sin respaldo en el texto.

Para cada afirmación indica la fuente: "Decisión", o la etiqueta exacta del contexto sin corchetes (por ejemplo "EMPRESA", "MERCADO", "DOCUMENTO: nombre", "SITIO: url").
El fragmento debe ser una cita TEXTUAL copiada del texto fuente, de máximo 25 palabras. No lo parafrasees.
Si es un supuesto sin respaldo, usa fuente "Sin respaldo" y fragmento "".

Devuelve exactamente este JSON:
{
  "evidencias": [{"afirmacion": "", "tipo": "Hecho|Inferencia|Supuesto", "fuente": "", "fragmento": ""}]
}`,
  }),

  sintesis: (p) => ({
    maxTokens: 1800,
    text: `${base(p)}${clar(p)}

ANÁLISIS DE LOS MÓDULOS:
${clip(JSON.stringify(p.modulos || {}), 14000)}

Actúa como estratega senior. Integra los análisis anteriores. No te limites a optimizar la propuesta inicial.
Determina: si el framing es correcto; qué alternativa puede crear más valor; los principales trade-offs; el costo de oportunidad; las condiciones críticas para el éxito; las incertidumbres; y la recomendación ejecutiva.
La confianza NO es probabilidad de éxito: es confianza analítica según la calidad del contexto, la consistencia entre señales y la incertidumbre. Si hay poco contexto, baja la confianza.
Veredictos permitidos: "Avanzar", "Avanzar con ajustes", "Reconsiderar", "Detener".

Devuelve exactamente este JSON:
{
  "veredicto": "",
  "confianza": 0,
  "sintesis": "de 2 a 4 párrafos cortos separados por \\n\\n",
  "factores": ["exactamente 3 factores decisivos"],
  "proximosPasos": ["exactamente 3 próximos pasos concretos"],
  "niveles": {"operativo": "qué hacer ahora", "estrategico": "qué posición construir", "transformacional": "qué alternativa cambiaría el juego"}
}`,
  }),
};

export function buildPrompt(step, payload) {
  const p = payload && typeof payload === 'object' ? payload : {};

  if (step === 'pdf') {
    const b64 = String(p.b64 || '');
    if (!b64 || b64.length > 4400000) return null;
    return {
      maxTokens: 1400,
      content: [
        { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: b64 } },
        {
          type: 'text',
          text: 'Resume este documento para usarlo como contexto en el análisis de una decisión empresarial. Incluye solo lo que dice el documento: datos, cifras, objetivos, restricciones y riesgos. Máximo 400 palabras. Devuelve texto plano, sin Markdown.',
        },
      ],
    };
  }

  const builder = STEPS[step];
  if (!builder) return null;
  if (!String(p.input || '').trim()) return null;
  const spec = builder(p);
  return { maxTokens: spec.maxTokens, content: spec.text };
}
