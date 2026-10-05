import { useState, useEffect, useRef } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, ScatterChart, Scatter, ZAxis, Cell,
  ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ReferenceLine, LabelList,
} from 'recharts';
import {
  Brain, Upload, FileText, Users, Layers, Scale, AlertTriangle, ShieldCheck, Download,
  RotateCcw, Sparkles, Target, ChevronRight, X, Gavel, BookOpen, Lock, Printer, Table,
  Lightbulb, ListChecks, Trash2, Globe, Paperclip, Link, Building2, TrendingUp,
  CheckCircle, CircleAlert, Compass, SlidersHorizontal, Quote,
} from 'lucide-react';
import { EXAMPLES, SIM_EMPRESA, SIM_MERCADO } from './examples.js';
import { runAnalysis, readFileForCtx, fetchUrl, buildCtxBlock } from './ai.js';
import {
  DIMS, DEFAULT_WEIGHTS, normalize, sanitizeHistory, sanitizeWeights, weighted, weightPct,
  exportTxt, exportCsv, fmtDate,
} from './lib.js';

const C = {
  red: '#b00020',
  blue: '#2A5B8C',
  blueBg: '#eef8ff',
  ink: '#222222',
  body: '#333333',
  mute: '#757575',
  line: '#e5e5e5',
  white: '#ffffff',
  pink: '#fff5f6',
  green: '#16a34a',
  amber: '#f59e0b',
};
const SUBSTACK = 'https://futuria.substack.com/';
const HIST_KEY = 'd360-v1';
const W_KEY = 'd360-pesos';
const CSS_ANIM = '@keyframes d360spin { to { transform: rotate(360deg); } }';
const GREY = '#9e9e9e';

const store = {
  get(k) {
    try {
      const v = window.localStorage.getItem(k);
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  },
  set(k, v) {
    try {
      window.localStorage.setItem(k, JSON.stringify(v));
      return true;
    } catch {
      return false;
    }
  },
};

const V_COLOR = {
  'Avanzar': C.green,
  'Avanzar con ajustes': C.amber,
  'Reconsiderar': '#d9480f',
  'Detener': C.red,
  'Ajustar': C.amber,
  'Sin veredicto': GREY,
};
const vColor = (v) => V_COLOR[v] || GREY;
const ST_COLOR = { Gana: C.green, Pierde: C.red, Bloquea: C.amber, Neutral: GREY };
const EV_COLOR = { Hecho: C.green, Inferencia: C.blue, Supuesto: C.amber };
const ESC_COLOR = { Optimista: C.green, Base: C.blue, Pesimista: C.red };
const semaforo = (n) => (n >= 70 ? C.green : n >= 40 ? C.amber : C.red);

const HELP = {
  confianza: 'Confianza analítica: qué tan sólido es el análisis según el contexto recibido, la coherencia entre módulos y la incertidumbre. NO es la probabilidad de que la decisión salga bien.',
  consenso: 'Promedio de los scores del panel (0 a 100). Indica cuánto coinciden las siete perspectivas, no si la decisión es correcta.',
  aFavor: 'Cuántos de los siete expertos dieron el veredicto "Avanzar". Es una simulación, no una votación real.',
  score: 'Qué tan favorable ve la decisión cada perspectiva, de 0 a 100. Es una estimación del modelo, no una medición.',
  probabilidad: 'Estimación aproximada para comparar escenarios entre sí. NO es una probabilidad estadística calculada con datos.',
  impacto: 'Dirección y magnitud estimadas del efecto, de -100 a +100. NO es una cifra financiera.',
  dimensiones: '0 es muy desfavorable, 50 neutral y 100 muy favorable. En riesgo, 100 significa riesgo controlado. Son juicios estimados, no mediciones.',
  ponderado: 'Promedio de las seis dimensiones usando los pesos que tú defines. Cambia si cambias los pesos. NO es una probabilidad de éxito.',
  pesos: 'El peso de cada criterio es tu decisión, no la del modelo. Muévelos para reflejar lo que más importa en esta decisión.',
  poderInteres: 'Poder: capacidad de influir en la decisión. Interés: cuánto le importa. Ambos son estimaciones de 0 a 100.',
  contexto: 'Indica cuánta información cargaste. Más contexto suele mejorar el análisis, pero no lo garantiza.',
  evidencia: 'Hecho: aparece en tu texto o documentos. Inferencia: conclusión apoyada en un fragmento. Supuesto: se da por cierto sin respaldo.',
};

function HelpTip({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="help" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        className="help-btn"
        aria-label={'Qué significa: ' + text}
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
      >
        ?
      </button>
      {open ? <span className="help-pop" role="tooltip">{text}</span> : null}
    </span>
  );
}

function Card({ children, style, className }) {
  return <div className={'card ' + (className || '')} style={style}>{children}</div>;
}

function TH({ icon: Icon, children, sub, help }) {
  return (
    <div className="th">
      <div className="th-row">
        {Icon ? <Icon size={20} color={C.red} aria-hidden="true" /> : null}
        <h2>{children}</h2>
        {help ? <HelpTip text={help} /> : null}
      </div>
      {sub ? <p className="th-sub">{sub}</p> : null}
    </div>
  );
}

function Ring({ value, size = 120, label }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - v / 100);
  const color = semaforo(v);
  const half = size / 2;
  return (
    <div className="ring" style={{ width: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${label || 'Valor'}: ${v} de 100`}>
        <circle cx={half} cy={half} r={r} fill="none" stroke={C.line} strokeWidth={stroke} />
        <circle
          cx={half}
          cy={half}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={off}
          strokeLinecap="round"
          transform={`rotate(-90 ${half} ${half})`}
        />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fontSize={size / 4.4} fontWeight="700" fill={C.ink}>
          {v}%
        </text>
      </svg>
      {label ? <div className="ring-label">{label}</div> : null}
    </div>
  );
}

function VBadge({ v, big }) {
  const col = vColor(v);
  return (
    <span className={'vbadge' + (big ? ' big' : '')} style={{ color: col, borderColor: col, background: col + '14' }}>
      {v}
    </span>
  );
}

function Chip({ children, color }) {
  const col = color || C.mute;
  return <span className="chip" style={{ color: col, borderColor: col + '55', background: col + '10' }}>{children}</span>;
}

function Empty({ icon: Icon, title, sub }) {
  return (
    <div className="empty">
      {Icon ? <Icon size={36} color={C.mute} aria-hidden="true" /> : null}
      <p className="empty-title">{title}</p>
      {sub ? <p className="empty-sub">{sub}</p> : null}
    </div>
  );
}

function StTip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0].payload;
  return (
    <div className="ctip">
      <strong>{p.nombre}</strong>
      <div>{p.postura} · Poder {p.poder} · Interés {p.interes}</div>
    </div>
  );
}

const HOW_STEPS = [
  { icon: Target, title: 'Describe tu decisión', text: 'Escribe qué quieres decidir, para qué, en qué plazo y quién decide. Una o dos frases claras bastan.', tip: 'Incluye la opción de no hacer nada: también es una alternativa.', chips: ['Mover pauta a otra red', 'Contratar una agencia', 'Lanzar una campaña'] },
  { icon: Building2, title: 'Añade contexto', text: 'Opcional. Describe tu empresa y tu mercado, pega hasta tres enlaces o sube hasta tres documentos.', tip: 'El análisis cita los fragmentos de tus documentos: carga los que de verdad aplican.', chips: ['Estrategia digital', 'Reporte de pauta', 'Calendario de contenido'] },
  { icon: Sparkles, title: 'Ejecuta el análisis', text: 'La herramienta reencuadra la decisión y la somete a un panel de siete expertos, escenarios y un bloque crítico.', tip: 'Tarda alrededor de un minuto. No cierres la pestaña.', chips: ['Pre-mortem', 'Escenarios', 'Panel'] },
  { icon: Users, title: 'Contrasta perspectivas', text: 'Revisa dónde discrepan los expertos, qué supuestos no tienen respaldo y qué podría salir mal.', tip: 'Los desacuerdos del panel son la parte más útil.', chips: ['CFO', 'Riesgos', 'Voz del mercado'] },
  { icon: Gavel, title: 'Decide qué hacer', text: 'Ajusta los pesos de los criterios, lee el reporte ejecutivo y exporta el análisis para tu reunión.', tip: 'El veredicto es una sugerencia: la decisión es tuya.', chips: ['Exportar TXT', 'Exportar CSV', 'Imprimir'] },
];

const GLOSARIO = [
  { t: 'Pre-mortem', d: 'Imaginar que la decisión ya fracasó y reconstruir por qué, para prevenirlo antes de empezar.' },
  { t: 'Argumento contrario', d: 'El mejor argumento razonable en contra de la propuesta, no una versión débil fácil de rebatir.' },
  { t: 'Stakeholder', d: 'Persona o grupo que gana, pierde, bloquea o queda neutral frente a la decisión.' },
  { t: 'Segundo orden', d: 'Efectos que provoca el primer impacto: lo que pasa después de lo que pasa.' },
  { t: 'Confianza', d: 'Qué tan sólido es el análisis con la información disponible. No es la probabilidad de éxito.' },
];

const NO_VEMOS = [
  '¿Qué supuestos estamos dando por ciertos?',
  '¿Qué podría invalidar todo el análisis?',
  '¿Qué cambio externo haría fracasar esta decisión?',
  '¿Qué haría un competidor excepcionalmente inteligente?',
  '¿Qué decisión podríamos lamentar dentro de cinco años?',
];

const urlOk = (u) => /^https?:\/\/[^\s/$.?#][^\s.]*\.[^\s]+$/i.test(String(u).trim());

export default function App() {
  const [tab, setTab] = useState('como');
  const [stage, setStage] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [about, setAbout] = useState(false);
  const [showEx, setShowEx] = useState(false);
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState('');
  const [fileName, setFileName] = useState('');

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);

  const [ctxEmpresa, setCtxEmpresa] = useState('');
  const [ctxMercado, setCtxMercado] = useState('');
  const [ctxU0, setCtxU0] = useState('');
  const [ctxU1, setCtxU1] = useState('');
  const [ctxU2, setCtxU2] = useState('');
  const [ctxDocs, setCtxDocs] = useState([]);
  const [ctxLoading, setCtxLoading] = useState(false);

  const importRef = useRef(null);
  const docRef = useRef(null);

  useEffect(() => {
    const h = store.get(HIST_KEY);
    if (h) setHistory(sanitizeHistory(h));
    const w = store.get(W_KEY);
    if (w) setWeights(sanitizeWeights(w));
  }, []);

  function saveHistory(list) {
    const clean = list.slice(0, 20);
    setHistory(clean);
    if (!store.set(HIST_KEY, clean)) {
      setNotice('Este navegador no permite guardar el historial. El análisis actual sigue disponible mientras no cierres la pestaña.');
    }
  }

  function updateWeights(w) {
    setWeights(w);
    store.set(W_KEY, w);
  }

  // Variables derivadas
  const urlsArr = [ctxU0, ctxU1, ctxU2];
  const urlSetters = [setCtxU0, setCtxU1, setCtxU2];
  const activeUrls = urlsArr.map((u) => u.trim()).filter(urlOk);
  const ctxScore = (ctxEmpresa.trim().length > 20 ? 1 : 0) + (ctxMercado.trim().length > 20 ? 1 : 0) + activeUrls.length + ctxDocs.length;
  const ctxHas = ctxScore > 0;
  const ctxLabel = ctxScore === 0 ? 'Sin contexto' : ctxScore <= 2 ? 'Básico' : ctxScore <= 4 ? 'Moderado' : 'Enriquecido';
  const ctxColor = ctxScore === 0 ? GREY : ctxScore <= 4 ? C.amber : C.green;
  const canAddDoc = ctxDocs.length < 3 && !ctxLoading;
  const hasDocs = ctxDocs.length > 0;
  const hasHist = history.length > 0;
  const inputOk = input.trim().length >= 30;

  const r = result;
  const dimData = r ? DIMS.map((d) => ({ dim: d.label, valor: r.dimensiones[d.key] })) : [];
  const consenso = r && r.expertos.length ? Math.round(r.expertos.reduce((a, e) => a + e.score, 0) / r.expertos.length) : 0;
  const aFavor = r ? r.expertos.filter((e) => e.veredicto === 'Avanzar').length : 0;
  const ponderado = r ? weighted(r.dimensiones, weights) : 0;
  const panelData = r ? r.expertos.map((e) => ({ rol: e.rol, score: e.score, veredicto: e.veredicto })) : [];
  const escData = r ? r.escenarios.map((e) => ({ nombre: e.nombre, impacto: e.impacto, probabilidad: e.probabilidad })) : [];
  const stGroups = r ? ['Gana', 'Pierde', 'Bloquea', 'Neutral'].map((p) => ({ postura: p, data: r.stakeholders.filter((s) => s.postura === p) })).filter((g) => g.data.length) : [];
  const evGroups = r ? ['Hecho', 'Inferencia', 'Supuesto'].map((t) => ({ tipo: t, items: r.evidencias.filter((e) => e.tipo === t) })) : [];
  const sintesisParas = r && r.sintesis ? r.sintesis.split(/\n\s*\n/).filter(Boolean) : [];
  const consecParas = r && r.consecuencias ? r.consecuencias.split(/\n/).filter(Boolean) : [];

  const tabs = [
    { id: 'como', label: 'Cómo usar' },
    { id: 'contexto', label: 'Contexto', badge: ctxHas },
    { id: 'analizar', label: 'Analizar' },
  ];
  if (r) {
    tabs.push(
      { id: 'reporte', label: 'Reporte ejecutivo' },
      { id: 'panel', label: 'Panel de expertos' },
      { id: 'escenarios', label: 'Escenarios' },
      { id: 'impacto', label: 'Impacto' },
      { id: 'stakeholders', label: 'Stakeholders' },
      { id: 'critico', label: 'Crítico' },
      { id: 'evidencia', label: 'Evidencia' },
    );
  }
  tabs.push({ id: 'privacidad', label: 'Privacidad' });

  // Acciones
  async function run() {
    setError('');
    setNotice('');
    const text = input.trim();
    if (text.length < 30) {
      setError('Describe la decisión con un poco más de detalle (mínimo 30 caracteres): qué quieres hacer, para qué y en qué plazo.');
      return;
    }
    setLoading(true);
    setStage('Preparando el contexto...');
    const notes = [];
    try {
      let web = [];
      if (activeUrls.length) {
        setStage('Leyendo los sitios web...');
        const res = await Promise.all(activeUrls.map(fetchUrl));
        web = res.filter((x) => x.ok);
        res.filter((x) => !x.ok).forEach((x) => notes.push(`No se pudo leer ${x.url}: ${x.error}`));
      }
      const ctx = buildCtxBlock({ empresa: ctxEmpresa, mercado: ctxMercado, docs: ctxDocs, web });
      const out = await runAnalysis({ input: text, ctx }, setStage);
      out.contextoNivel = ctxLabel;
      setResult(out);
      const item = {
        id: String(out.createdAt),
        decision: out.decision !== 'No informado' ? out.decision : text.slice(0, 160),
        veredicto: out.veredicto,
        confianza: out.confianza,
        createdAt: out.createdAt,
        data: out,
      };
      saveHistory([item, ...history]);
      if (out.modulosFallidos > 0) {
        notes.push(`${out.modulosFallidos} parte(s) del análisis no respondieron y se muestran incompletas. Puedes ejecutarlo de nuevo.`);
      }
      setNotice(notes.join(' '));
      setTab('reporte');
    } catch (e) {
      setError(e && e.message ? e.message : 'No se pudo completar el análisis. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
      setStage('');
    }
  }

  async function onDoc(e) {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f || ctxDocs.length >= 3) return;
    setCtxLoading(true);
    setError('');
    try {
      const d = await readFileForCtx(f);
      setCtxDocs((prev) => [...prev, d].slice(0, 3));
    } catch (err) {
      setError(err && err.message ? err.message : 'No se pudo leer el documento.');
    } finally {
      setCtxLoading(false);
    }
  }

  function onImport(e) {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;
    const lower = f.name.toLowerCase();
    if (!(lower.endsWith('.txt') || lower.endsWith('.md') || lower.endsWith('.csv'))) {
      setError('Para importar la decisión usa un archivo TXT. Los PDF se cargan en la pestaña Contexto.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setInput(String(reader.result || '').slice(0, 6000));
      setFileName(f.name);
      setError('');
    };
    reader.onerror = () => setError('No se pudo leer el archivo.');
    reader.readAsText(f);
  }

  function loadExample(ex) {
    setInput(ex.input);
    setFileName('');
    setResult(normalize({
      ...ex.result,
      esEjemplo: true,
      contextoNivel: 'Moderado (simulado)',
      ctxEjemplo: { empresa: SIM_EMPRESA, mercado: SIM_MERCADO },
      createdAt: Date.now(),
    }));
    setShowEx(false);
    setError('');
    setNotice('');
    setTab('reporte');
  }

  function newDecision() {
    setResult(null);
    setInput('');
    setFileName('');
    setNotice('');
    setError('');
    setTab('analizar');
  }

  function reopen(item) {
    setResult(normalize(item.data));
    setNotice('');
    setError('');
    setTab('reporte');
  }

  function removeHist(id) {
    saveHistory(history.filter((h) => h.id !== id));
  }

  // Pestañas
  function renderComo() {
    return (
      <div className="stack">
        <Card className="hero">
          <h1 className="hero-title">Pon a prueba tus decisiones antes de ejecutarlas.</h1>
          <p className="lead">
            Decisión 360° somete una decisión a siete perspectivas expertas, tres escenarios y un bloque crítico, separa los hechos de los supuestos y te entrega un reporte ejecutivo. Esta versión está preparada para decisiones de estrategia digital: pauta, contenido orgánico y canales de venta.
          </p>
          <div className="row gap">
            <button type="button" className="btn btn-primary" onClick={() => setTab('contexto')}>Empezar ahora</button>
            <button type="button" className="btn btn-sec" onClick={() => setShowEx(true)}>Ver un ejemplo</button>
          </div>
        </Card>
        <div className="steps">
          {HOW_STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={s.title} className="step">
                <div className="step-head">
                  <span className="step-n">{i + 1}</span>
                  <Icon size={18} color={C.red} aria-hidden="true" />
                  <h3>{s.title}</h3>
                </div>
                <p>{s.text}</p>
                <p className="tip"><Lightbulb size={14} aria-hidden="true" /> {s.tip}</p>
                <div className="chips">{s.chips.map((c) => <Chip key={c}>{c}</Chip>)}</div>
              </Card>
            );
          })}
        </div>
        <Card>
          <TH icon={BookOpen} sub="Los términos que vas a encontrar en el reporte.">Glosario</TH>
          <dl className="gloss">
            {GLOSARIO.map((g) => (
              <div key={g.t} className="gloss-item">
                <dt>{g.t}</dt>
                <dd>{g.d}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    );
  }

  function renderContexto() {
    return (
      <div className="stack">
        <Card>
          <div className="ctx-top">
            <TH icon={Building2} sub="Todo es opcional. Más contexto puede mejorar la calidad del análisis, pero no es obligatorio." help={HELP.contexto}>Contexto</TH>
            <span className="ctx-level" style={{ color: ctxColor, borderColor: ctxColor }}>{ctxLabel}</span>
          </div>
          <div className="grid2">
            <div>
              <label className="lbl" htmlFor="ctx-empresa">Empresa</label>
              <textarea id="ctx-empresa" className="ta" rows={5} value={ctxEmpresa} onChange={(e) => setCtxEmpresa(e.target.value)} placeholder="Describe tu empresa, modelo de negocio, tamaño, capacidades o situación actual." />
            </div>
            <div>
              <label className="lbl" htmlFor="ctx-mercado">Mercado</label>
              <textarea id="ctx-mercado" className="ta" rows={5} value={ctxMercado} onChange={(e) => setCtxMercado(e.target.value)} placeholder="Describe mercado, industria, competencia, clientes o tendencias relevantes." />
            </div>
          </div>
        </Card>
        <div className="grid2">
          <Card>
            <TH icon={Globe} sub="Hasta tres sitios públicos. La app lee su texto al ejecutar el análisis.">Sitios web</TH>
            {urlsArr.map((u, i) => {
              const valid = urlOk(u);
              const filled = u.trim().length > 0;
              return (
                <div key={i} className="url-row">
                  <Link size={16} color={C.mute} aria-hidden="true" />
                  <input
                    className="inp"
                    type="url"
                    aria-label={`Sitio web ${i + 1}`}
                    placeholder="https://..."
                    value={u}
                    onChange={(e) => urlSetters[i](e.target.value)}
                  />
                  {filled ? (valid ? <CheckCircle size={18} color={C.green} aria-label="Dirección válida" /> : <CircleAlert size={18} color={C.amber} aria-label="Dirección incompleta" />) : null}
                </div>
              );
            })}
          </Card>
          <Card>
            <TH icon={Paperclip} sub="Hasta tres documentos en PDF, TXT o CSV. Los PDF se resumen con IA; no se guardan archivos.">Documentos</TH>
            <input ref={docRef} type="file" accept=".pdf,.txt,.csv,.md" className="hidden" onChange={onDoc} />
            <button type="button" className="btn btn-sec" disabled={!canAddDoc} onClick={() => docRef.current && docRef.current.click()}>
              <Upload size={16} aria-hidden="true" /> {ctxLoading ? 'Procesando documento...' : 'Subir documento'}
            </button>
            {hasDocs ? (
              <ul className="doclist">
                {ctxDocs.map((d, i) => (
                  <li key={d.name + i}>
                    <FileText size={16} color={C.blue} aria-hidden="true" />
                    <span className="doc-name">{d.name}</span>
                    <span className="doc-size">{d.content.length.toLocaleString('es-GT')} caracteres</span>
                    <button type="button" className="icon-btn" aria-label={'Quitar ' + d.name} onClick={() => setCtxDocs(ctxDocs.filter((_, j) => j !== i))}>
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted small">Aún no cargaste documentos.</p>
            )}
          </Card>
        </div>
        <div className="row gap end">
          <button type="button" className="btn btn-sec" onClick={() => setTab('analizar')}>Saltar contexto</button>
          <button type="button" className="btn btn-primary" onClick={() => setTab('analizar')}>Continuar al análisis <ChevronRight size={16} aria-hidden="true" /></button>
        </div>
      </div>
    );
  }

  function renderAnalizar() {
    return (
      <div className="analyze">
        <div className="stack">
          <Card>
            <div className="ctx-top">
              <TH icon={Brain} sub="Incluye objetivo, opciones, restricciones, plazo y personas afectadas si las conoces.">Tu decisión</TH>
              {ctxHas ? (
                <span className="ctx-pill">
                  <ShieldCheck size={14} aria-hidden="true" /> Contexto {ctxLabel.toLowerCase()}
                  <button type="button" className="link-btn" onClick={() => setTab('contexto')}>Editar</button>
                </span>
              ) : null}
            </div>
            <label className="sr" htmlFor="decision">Decisión</label>
            <textarea
              id="decision"
              className="ta ta-big"
              rows={8}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe la decisión que estás evaluando. Incluye objetivo, contexto, opciones, restricciones, horizonte temporal y personas afectadas si las conoces."
              disabled={loading}
            />
            <div className="row between small muted">
              <span>{fileName ? 'Importado de ' + fileName : 'Mínimo 30 caracteres'}</span>
              <span>{input.trim().length} caracteres</span>
            </div>
            <div className="row gap wrap actions">
              <input ref={importRef} type="file" accept=".txt,.md,.csv" className="hidden" onChange={onImport} />
              <button type="button" className="btn btn-sec" disabled={loading} onClick={() => importRef.current && importRef.current.click()}>
                <Upload size={16} aria-hidden="true" /> Importar archivo
              </button>
              <button type="button" className="btn btn-sec" disabled={loading} onClick={() => setShowEx(true)}>
                <Sparkles size={16} aria-hidden="true" /> Cargar ejemplo
              </button>
              <button type="button" className="btn btn-primary btn-cta" disabled={loading || !inputOk} onClick={run} title={inputOk ? 'Ejecutar el análisis' : 'Escribe al menos 30 caracteres'}>
                {loading ? 'Analizando...' : 'Ejecutar análisis 360°'}
              </button>
            </div>
          </Card>
          {loading ? (
            <Card className="loading" aria-live="polite">
              <style>{CSS_ANIM}</style>
              <span className="spinner" aria-hidden="true" />
              <div>
                <p className="loading-stage">{stage}</p>
                <p className="muted small">El análisis completo tarda alrededor de un minuto. No cierres la pestaña.</p>
              </div>
            </Card>
          ) : null}
          {!loading && !r ? (
            <Card>
              <Empty icon={Compass} title="Toda gran decisión merece ser cuestionada antes de ejecutarse." sub="Describe una decisión importante o carga uno de los ejemplos." />
            </Card>
          ) : null}
        </div>
        <Card className="hist">
          <TH icon={ListChecks} sub="Se guarda solo en este navegador (máximo 20).">Historial</TH>
          {hasHist ? (
            <ul className="hist-list">
              {history.map((h) => (
                <li key={h.id}>
                  <button type="button" className="hist-open" onClick={() => reopen(h)}>
                    <span className="hist-dec">{h.decision}</span>
                    <span className="hist-meta">
                      <VBadge v={h.veredicto} /> <span className="muted small">Confianza {h.confianza}% · {fmtDate(h.createdAt)}</span>
                    </span>
                  </button>
                  <button type="button" className="icon-btn" aria-label="Borrar del historial" onClick={() => removeHist(h.id)}>
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted small">Tus análisis aparecerán aquí para reabrirlos después.</p>
          )}
        </Card>
      </div>
    );
  }

  function renderReporte() {
    return (
      <div className="stack">
        {r.esEjemplo ? <div className="banner info"><Sparkles size={16} aria-hidden="true" /> <span>Ejemplo con datos simulados: el reporte viene precargado y no se llamó al modelo. Para analizar tu propia decisión, usa "Nueva decisión".</span></div> : null}
        <Card className="report-head">
          <div className="report-main">
            <p className="kicker">Decisión analizada</p>
            <h1 className="report-title">{r.decision}</h1>
            <p className="muted"><strong>Objetivo:</strong> {r.objetivo}</p>
            <div className="row gap wrap">
              <VBadge v={r.veredicto} big />
              {r.nivel ? <Chip color={C.blue}>Nivel {r.nivel.toLowerCase()}</Chip> : null}
              <span className="muted small">{fmtDate(r.createdAt)}</span>
            </div>
          </div>
          <div className="report-ring">
            <Ring value={r.confianza} size={128} label="Confianza analítica" />
            <HelpTip text={HELP.confianza} />
          </div>
        </Card>

        <div className="metrics">
          <Card className="metric"><span className="m-label">Consenso del panel <HelpTip text={HELP.consenso} /></span><span className="m-val">{consenso}<small>/100</small></span></Card>
          <Card className="metric"><span className="m-label">Expertos a favor <HelpTip text={HELP.aFavor} /></span><span className="m-val">{aFavor}<small>/7</small></span></Card>
          <Card className="metric"><span className="m-label">Puntaje con tus pesos <HelpTip text={HELP.ponderado} /></span><span className="m-val" style={{ color: semaforo(ponderado) }}>{ponderado}<small>/100</small></span></Card>
          <Card className="metric"><span className="m-label">Nivel de contexto <HelpTip text={HELP.contexto} /></span><span className="m-val m-text">{r.contextoNivel}</span></Card>
        </div>

        <Card>
          <TH icon={Brain}>Síntesis ejecutiva</TH>
          {sintesisParas.length ? sintesisParas.map((p, i) => <p key={i} className="para">{p}</p>) : <p className="muted">La síntesis no respondió. Ejecuta el análisis de nuevo.</p>}
          {r.preguntaSuperior ? (
            <div className="insight">
              <Lightbulb size={18} color={C.red} aria-hidden="true" />
              <div><strong>La pregunta de fondo</strong><p>{r.preguntaSuperior}</p></div>
            </div>
          ) : null}
        </Card>

        <div className="grid2">
          <Card>
            <TH icon={Target}>Factores decisivos</TH>
            <ol className="numbered">
              {r.factores.map((f, i) => <li key={i}><span className="num-dot">{i + 1}</span><span>{f}</span></li>)}
            </ol>
          </Card>
          <Card>
            <TH icon={TrendingUp}>Próximos pasos</TH>
            <ul className="next">
              {r.proximosPasos.map((p, i) => <li key={i}><ChevronRight size={18} color={C.red} aria-hidden="true" /><span>{p}</span></li>)}
            </ul>
          </Card>
        </div>

        <Card>
          <TH icon={Compass} sub="Antes de optimizar la propuesta, el análisis revisa si es la pregunta correcta.">Reencuadre</TH>
          <div className="grid2">
            <div>
              <h3 className="h3">Alternativas consideradas</h3>
              {r.alternativas.length ? <ul className="bullets">{r.alternativas.map((a, i) => <li key={i}>{a}</li>)}</ul> : <p className="muted small">No informado.</p>}
            </div>
            <div>
              <h3 className="h3">Qué tendría que ser cierto</h3>
              {r.queTendriaQueSerCierto.length ? <ul className="bullets">{r.queTendriaQueSerCierto.map((a, i) => <li key={i}>{a}</li>)}</ul> : <p className="muted small">No informado.</p>}
            </div>
          </div>
          {r.costoOportunidad ? <p className="para"><strong>Costo de oportunidad:</strong> {r.costoOportunidad}</p> : null}
          {r.niveles.operativo || r.niveles.estrategico || r.niveles.transformacional ? (
            <div className="levels">
              <div><span className="lvl-name">Operativo</span><p>{r.niveles.operativo || 'No informado'}</p></div>
              <div><span className="lvl-name">Estratégico</span><p>{r.niveles.estrategico || 'No informado'}</p></div>
              <div><span className="lvl-name">Transformacional</span><p>{r.niveles.transformacional || 'No informado'}</p></div>
            </div>
          ) : null}
        </Card>

        <div className="row gap wrap no-print">
          <button type="button" className="btn btn-sec" onClick={() => exportTxt(r, weights)}><Download size={16} aria-hidden="true" /> Exportar TXT</button>
          <button type="button" className="btn btn-sec" onClick={() => exportCsv(r, weights)}><Table size={16} aria-hidden="true" /> Exportar CSV</button>
          <button type="button" className="btn btn-sec" onClick={() => window.print()}><Printer size={16} aria-hidden="true" /> Imprimir / PDF</button>
          <button type="button" className="btn btn-primary" onClick={newDecision}><RotateCcw size={16} aria-hidden="true" /> Nueva decisión</button>
        </div>
        <p className="muted small">El análisis sugiere un camino; no reemplaza el juicio de quien decide.</p>
      </div>
    );
  }

  function renderPanel() {
    if (!r.expertos.length) return <Card><Empty icon={Users} title="El panel no respondió." sub="Ejecuta el análisis de nuevo para obtener las siete perspectivas." /></Card>;
    return (
      <div className="stack">
        <Card>
          <TH icon={Users} sub="Siete perspectivas independientes. Sus desacuerdos son información útil." help={HELP.score}>Panel de expertos</TH>
          <div className="chart">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={panelData} layout="vertical" margin={{ left: 8, right: 36, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="rol" width={130} tick={{ fontSize: 12 }} />
                <Tooltip />
                <ReferenceLine x={50} stroke={C.mute} strokeDasharray="4 4" />
                <Bar dataKey="score" name="Score" radius={[0, 4, 4, 0]}>
                  {panelData.map((d) => <Cell key={d.rol} fill={vColor(d.veredicto)} />)}
                  <LabelList dataKey="score" position="right" fontSize={12} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <div className="cards3">
          {r.expertos.map((e) => (
            <Card key={e.rol} className={e.faltante ? 'faded' : ''}>
              <div className="row between">
                <h3 className="h3">{e.rol}</h3>
                <span className="score" style={{ color: vColor(e.veredicto) }}>{e.score}</span>
              </div>
              <VBadge v={e.veredicto} />
              <p className="small"><strong>Preocupación:</strong> {e.preocupacion}</p>
              <p className="small"><strong>Recomendación:</strong> {e.recomendacion}</p>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  function renderEscenarios() {
    if (!r.escenarios.length) return <Card><Empty icon={LineIcon} title="Los escenarios no respondieron." sub="Ejecuta el análisis de nuevo." /></Card>;
    return (
      <div className="stack">
        <Card>
          <TH icon={Layers} sub="Impacto estimado de -100 a +100 y probabilidad aproximada de cada escenario." help={HELP.impacto}>Escenarios</TH>
          <div className="chart">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={escData} margin={{ top: 20, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="nombre" tick={{ fontSize: 13 }} />
                <YAxis domain={[-100, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <ReferenceLine y={0} stroke={C.ink} />
                <Bar dataKey="impacto" name="Impacto" radius={[4, 4, 0, 0]}>
                  {escData.map((d) => <Cell key={d.nombre} fill={ESC_COLOR[d.nombre] || C.blue} />)}
                  <LabelList dataKey="impacto" position="top" fontSize={12} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <div className="cards3">
          {r.escenarios.map((e) => (
            <Card key={e.nombre} style={{ borderTop: `4px solid ${ESC_COLOR[e.nombre] || C.blue}` }}>
              <h3 className="h3">{e.nombre}</h3>
              <div className="row gap small">
                <span>Probabilidad aprox. <strong>{e.probabilidad}%</strong> <HelpTip text={HELP.probabilidad} /></span>
                <span>Impacto <strong>{e.impacto > 0 ? '+' + e.impacto : e.impacto}</strong></span>
              </div>
              <p className="para">{e.narrativa}</p>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  function renderImpacto() {
    return (
      <div className="stack">
        <div className="grid2">
          <Card>
            <TH icon={Target} sub="Seis dimensiones de 0 a 100." help={HELP.dimensiones}>Impacto multidimensional</TH>
            <div className="chart">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={dimData} outerRadius="72%">
                  <PolarGrid />
                  <PolarAngleAxis dataKey="dim" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} angle={90} />
                  <Radar dataKey="valor" name="Valor" stroke={C.red} fill={C.red} fillOpacity={0.18} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card>
            <TH icon={SlidersHorizontal} sub="Define cuánto pesa cada criterio en tu decisión." help={HELP.pesos}>Tus pesos</TH>
            {DIMS.map((d) => (
              <div key={d.key} className="wrow">
                <label htmlFor={'w-' + d.key}>{d.label}</label>
                <input
                  id={'w-' + d.key}
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={weights[d.key]}
                  onChange={(e) => updateWeights({ ...weights, [d.key]: Number(e.target.value) })}
                />
                <span className="wval">{weightPct(weights, d.key)}%</span>
              </div>
            ))}
            <div className="weighted">
              <span>Puntaje ponderado <HelpTip text={HELP.ponderado} /></span>
              <strong style={{ color: semaforo(ponderado) }}>{ponderado}/100</strong>
            </div>
            <button type="button" className="link-btn" onClick={() => updateWeights(DEFAULT_WEIGHTS)}>Restablecer pesos</button>
          </Card>
        </div>
        <div className="dimgrid">
          {DIMS.map((d) => {
            const v = r.dimensiones[d.key];
            return (
              <Card key={d.key} className="dimcard">
                <span className="small muted">{d.label}</span>
                <span className="m-val" style={{ color: semaforo(v) }}>{v}</span>
                <div className="bar"><span style={{ width: v + '%', background: semaforo(v) }} /></div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  function renderStakeholders() {
    if (!r.stakeholders.length) return <Card><Empty icon={Users} title="El mapa de actores no respondió." sub="Ejecuta el análisis de nuevo." /></Card>;
    return (
      <div className="stack">
        <Card>
          <TH icon={Users} sub="Poder contra interés: arriba a la derecha están quienes más pueden mover la decisión." help={HELP.poderInteres}>Mapa de stakeholders</TH>
          <div className="chart">
            <ResponsiveContainer width="100%" height={340}>
              <ScatterChart margin={{ top: 16, right: 24, bottom: 24, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="poder" name="Poder" domain={[0, 100]} tick={{ fontSize: 12 }} label={{ value: 'Poder', position: 'insideBottom', offset: -12, fontSize: 12 }} />
                <YAxis type="number" dataKey="interes" name="Interés" domain={[0, 100]} tick={{ fontSize: 12 }} label={{ value: 'Interés', angle: -90, position: 'insideLeft', fontSize: 12 }} />
                <ZAxis range={[140, 140]} />
                <ReferenceLine x={50} stroke={C.line} />
                <ReferenceLine y={50} stroke={C.line} />
                <Tooltip content={<StTip />} />
                <Legend verticalAlign="top" height={30} />
                {stGroups.map((g) => <Scatter key={g.postura} name={g.postura} data={g.data} fill={ST_COLOR[g.postura]} />)}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <ul className="st-list">
            {r.stakeholders.map((s) => (
              <li key={s.nombre}>
                <span className="st-dot" style={{ background: ST_COLOR[s.postura] }} aria-hidden="true" />
                <span className="st-name">{s.nombre}</span>
                <Chip color={ST_COLOR[s.postura]}>{s.postura}</Chip>
                <span className="muted small">Poder {s.poder} · Interés {s.interes}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    );
  }

  function renderCritico() {
    return (
      <div className="stack">
        <div className="cards3">
          <Card className="crit" style={{ borderColor: C.red }}>
            <TH icon={AlertTriangle}>Pre-mortem</TH>
            <p className="small muted">Pasaron 12 a 24 meses y la decisión fracasó. ¿Por qué?</p>
            <p className="para">{r.preMortem || 'No informado.'}</p>
          </Card>
          <Card className="crit" style={{ borderColor: C.amber }}>
            <TH icon={Scale}>Argumento contrario</TH>
            <p className="small muted">El mejor argumento razonable en contra.</p>
            <p className="para">{r.argumentoContrario || 'No informado.'}</p>
          </Card>
          <Card className="crit" style={{ borderColor: C.blue }}>
            <TH icon={Layers}>Consecuencias</TH>
            <p className="small muted">Primer, segundo y tercer orden.</p>
            {consecParas.length ? consecParas.map((p, i) => <p key={i} className="para">{p}</p>) : <p className="para">No informado.</p>}
          </Card>
        </div>
        <Card className="pinkcard">
          <TH icon={CircleAlert} sub="Las preguntas que una buena decisión debe resistir.">¿Qué no estamos viendo?</TH>
          <ol className="qlist">
            {NO_VEMOS.map((qn, i) => (
              <li key={i}>
                <strong>{qn}</strong>
                <p>{r.noEstamosViendo[i] || 'No informado.'}</p>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    );
  }

  function renderEvidencia() {
    return (
      <div className="stack">
        <Card>
          <TH icon={Quote} sub="Cada afirmación indica de dónde salió. Revisa los supuestos: son lo primero que hay que validar." help={HELP.evidencia}>Hechos, inferencias y supuestos</TH>
          {r.evidencias.length ? (
            <div className="evgrid">
              {evGroups.map((g) => (
                <div key={g.tipo}>
                  <h3 className="h3" style={{ color: EV_COLOR[g.tipo] }}>{g.tipo === 'Hecho' ? 'Hechos' : g.tipo === 'Inferencia' ? 'Inferencias' : 'Supuestos'} ({g.items.length})</h3>
                  {g.items.length ? g.items.map((e, i) => (
                    <div key={i} className="ev" style={{ borderLeftColor: EV_COLOR[g.tipo] }}>
                      <p className="ev-claim">{e.afirmacion}</p>
                      <p className="small muted">Fuente: {e.fuente}</p>
                      {e.fragmento ? <blockquote className="ev-quote">«{e.fragmento}»</blockquote> : <p className="small ev-none">Sin fragmento que lo respalde.</p>}
                    </div>
                  )) : <p className="muted small">Ninguno.</p>}
                </div>
              ))}
            </div>
          ) : (
            <Empty icon={Quote} title="La separación de evidencia no respondió." sub="Ejecuta el análisis de nuevo." />
          )}
        </Card>
        {r.ctxEjemplo ? (
          <Card className="bluecard">
            <TH icon={FileText} sub="Texto del que salen los fragmentos citados en este ejemplo.">Contexto del ejemplo (simulado)</TH>
            <p className="small"><strong>EMPRESA:</strong> {r.ctxEjemplo.empresa}</p>
            <p className="small"><strong>MERCADO:</strong> {r.ctxEjemplo.mercado}</p>
          </Card>
        ) : null}
      </div>
    );
  }

  function renderPrivacidad() {
    return (
      <Card>
        <TH icon={Lock} sub="Cómo trata esta versión la información que cargas.">Privacidad</TH>
        <ol className="privacy">
          <li><strong>Qué se envía al modelo.</strong> El texto de tu decisión y el contexto que cargues (empresa, mercado, resúmenes de documentos y texto de los sitios web) se envían desde el servidor de esta aplicación a Claude, de Anthropic, a través de Vercel AI Gateway. El tratamiento en esos servicios se rige por sus propias políticas.</li>
          <li><strong>Qué queda en tu navegador.</strong> El historial (hasta 20 análisis) y tus pesos se guardan en el almacenamiento local de este navegador. No se comparten con otras personas ni con otros dispositivos, y se borran si limpias los datos del navegador.</li>
          <li><strong>Archivos.</strong> Los TXT y CSV se leen en tu navegador y solo se usa su texto. Los PDF se envían al modelo para resumirlos. La aplicación no guarda archivos en ningún servidor.</li>
          <li><strong>Sitios web.</strong> Al ejecutar el análisis, el servidor de la aplicación descarga el texto público de los sitios que indiques y lo incluye en el contexto. No se guarda.</li>
          <li><strong>Recomendación.</strong> No cargues datos de clientes, cifras confidenciales ni datos personales sin autorización. Los ejemplos de esta versión usan datos simulados.</li>
        </ol>
      </Card>
    );
  }

  const RENDER = {
    como: renderComo,
    contexto: renderContexto,
    analizar: renderAnalizar,
    reporte: renderReporte,
    panel: renderPanel,
    escenarios: renderEscenarios,
    impacto: renderImpacto,
    stakeholders: renderStakeholders,
    critico: renderCritico,
    evidencia: renderEvidencia,
    privacidad: renderPrivacidad,
  };
  const needsResult = ['reporte', 'panel', 'escenarios', 'impacto', 'stakeholders', 'critico', 'evidencia'];
  const activeTab = needsResult.includes(tab) && !r ? 'analizar' : tab;
  const body = (RENDER[activeTab] || renderComo)();

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <span className="logo" aria-hidden="true">F</span>
          <span className="brand-name">FuturIA</span>
          <span className="sep" aria-hidden="true" />
          <div>
            <span className="product">Decisión 360°</span>
            <span className="tagline">Pon a prueba tus decisiones antes de ejecutarlas.</span>
          </div>
        </div>
        <div className="row gap header-actions no-print">
          <button type="button" className="btn btn-sec" onClick={() => setAbout(true)}>Acerca de</button>
          <a className="btn btn-primary" href={SUBSTACK} target="_blank" rel="noopener noreferrer">Únete a FuturIA</a>
        </div>
      </header>

      <nav className="tabs no-print" aria-label="Secciones">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={'tab' + (activeTab === t.id ? ' active' : '')}
            aria-current={activeTab === t.id ? 'page' : undefined}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {t.badge ? <span className="tab-badge" aria-label="con contexto cargado" /> : null}
          </button>
        ))}
      </nav>

      <main className="main">
        {error ? (
          <div className="banner err no-print" role="alert">
            <CircleAlert size={16} aria-hidden="true" /> <span>{error}</span>
            <button type="button" className="icon-btn" aria-label="Cerrar aviso" onClick={() => setError('')}><X size={16} /></button>
          </div>
        ) : null}
        {notice ? (
          <div className="banner info no-print" role="status">
            <Lightbulb size={16} aria-hidden="true" /> <span>{notice}</span>
            <button type="button" className="icon-btn" aria-label="Cerrar aviso" onClick={() => setNotice('')}><X size={16} /></button>
          </div>
        ) : null}
        {body}
      </main>

      <footer className="footer no-print">
        <span>Decisión 360° · FuturIA. Versión académica para decisiones de estrategia digital.</span>
        <a href={SUBSTACK} target="_blank" rel="noopener noreferrer">futuria.substack.com</a>
      </footer>

      {showEx ? (
        <div className="modal-bg" role="dialog" aria-modal="true" aria-label="Ejemplos" onClick={() => setShowEx(false)}>
          <div className="modal wide" onClick={(e) => e.stopPropagation()}>
            <div className="row between">
              <h2 className="modal-title">Ejemplos de estrategia digital</h2>
              <button type="button" className="icon-btn" aria-label="Cerrar" onClick={() => setShowEx(false)}><X size={18} /></button>
            </div>
            <p className="muted small">Casos completos con datos simulados de una empresa de mariscos. Se abren al instante, sin llamar al modelo.</p>
            <div className="exgrid">
              {EXAMPLES.map((ex) => (
                <button key={ex.id} type="button" className="excard" onClick={() => loadExample(ex)}>
                  <span className="ex-area">{ex.area}</span>
                  <span className="ex-title">{ex.titulo}</span>
                  <span className="small muted">{ex.monto}</span>
                  <VBadge v={ex.resultado} />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {about ? (
        <div className="modal-bg" role="dialog" aria-modal="true" aria-label="Acerca de" onClick={() => setAbout(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="row between">
              <h2 className="modal-title">FuturIA</h2>
              <button type="button" className="icon-btn" aria-label="Cerrar" onClick={() => setAbout(false)}><X size={18} /></button>
            </div>
            <p className="para">FuturIA es una comunidad global en español dedicada a comprender y aplicar inteligencia artificial.</p>
            <p className="para">Decisión 360° es una herramienta de FuturIA para poner a prueba decisiones antes de ejecutarlas. Esta versión académica la adapta a decisiones de estrategia digital: pauta, contenido orgánico y canales de venta.</p>
            <div className="row gap">
              <a className="btn btn-primary" href={SUBSTACK} target="_blank" rel="noopener noreferrer">Únete a FuturIA</a>
              <button type="button" className="btn btn-sec" onClick={() => setAbout(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function LineIcon(props) {
  return <TrendingUp {...props} />;
}
