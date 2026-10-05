// Casos de ejemplo con datos SIMULADOS. No contienen cifras reales de ninguna empresa.
// Cada caso trae el resultado completo para que la app se entienda sin esperar un análisis.

export const SIM_EMPRESA =
  'Caso simulado: empresa guatemalteca de mariscos con venta B2C por WhatsApp, redes sociales y tienda en línea, y venta B2B a restaurantes. Equipo de mercadeo de 3 personas que produce el contenido en casa.';

export const SIM_MERCADO =
  'Caso simulado: la demanda sube con fuerza en Cuaresma; compiten supermercados y pescaderías con presencia en redes; los clientes buscan frescura, entrega a domicilio y recetas fáciles.';

const E = (rol, veredicto, score, preocupacion, recomendacion) => ({ rol, veredicto, score, preocupacion, recomendacion });
const S = (nombre, postura, poder, interes) => ({ nombre, postura, poder, interes });
const V = (afirmacion, tipo, fuente, fragmento) => ({ afirmacion, tipo, fuente, fragmento });

export const EXAMPLES = [
  {
    id: 'tiktok',
    titulo: 'Mover parte de la pauta a TikTok',
    area: 'Pauta',
    monto: 'Q 12,000 al mes (simulado)',
    resultado: 'Avanzar con ajustes',
    input:
      'Estamos evaluando mover el 30% del presupuesto mensual de pauta (Q 12,000 de Q 40,000, cifras simuladas) de Facebook e Instagram a TikTok Ads durante los próximos 6 meses, para llegar a compradores de 25 a 40 años en Ciudad de Guatemala. Decide la jefa de mercadeo con aprobación de gerencia.',
    result: {
      decision: 'Reasignar el 30% de la pauta mensual de Meta a TikTok Ads durante 6 meses.',
      objetivo: 'Ganar alcance entre compradores de 25 a 40 años sin subir el presupuesto total de pauta.',
      contexto: 'Presupuesto de pauta de Q 40,000 al mes concentrado en Facebook e Instagram; ventas B2C por WhatsApp y tienda en línea.',
      preguntaSuperior: '¿Cómo diversificamos la captación de clientes digitales sin perder el rendimiento que hoy nos da Meta?',
      nivel: 'Táctico',
      alternativas: [
        'Mover el 30% de golpe durante 6 meses (propuesta original).',
        'Piloto de 8 semanas con el 10% del presupuesto y una meta de costo por conversación.',
        'Construir contenido orgánico en TikTok antes de pautar.',
        'Mantener Meta y probar video corto en Reels, donde la audiencia ya está.',
      ],
      queTendriaQueSerCierto: [
        'Que el público objetivo compre mariscos desde TikTok, no solo que lo vea.',
        'Que el equipo pueda producir video corto nativo cada semana.',
        'Que el costo por conversación de WhatsApp desde TikTok se acerque al de Meta.',
        'Que exista forma de atribuir ventas a cada plataforma.',
      ],
      costoOportunidad: 'Cada quetzal que sale de Meta deja de financiar el canal que hoy trae la mayoría de conversaciones de venta.',
      veredicto: 'Avanzar con ajustes',
      confianza: 58,
      sintesis:
        'El análisis sugiere que diversificar hacia TikTok tiene sentido estratégico, pero mover el 30% de golpe expone las ventas sin evidencia previa. El problema real no es en qué red pautar, sino cómo diversificar la captación sin perder rendimiento.\n\nLa ruta con mejor relación entre aprendizaje y riesgo es un piloto acotado, con meta de costo por conversación y ventas atribuidas, que se amplía solo si iguala o supera a Meta. La confianza es moderada porque no hay datos propios de TikTok y el caso es simulado.',
      factores: [
        'No existe evidencia propia del rendimiento de TikTok para la marca.',
        'La capacidad del equipo para producir video corto nativo es el cuello de botella.',
        'Meta concentra hoy las conversaciones que terminan en venta.',
      ],
      proximosPasos: [
        'Diseñar un piloto de 8 semanas con el 10% del presupuesto y una regla de corte.',
        'Producir 12 videos cortos nativos antes de lanzar la pauta.',
        'Configurar el seguimiento de ventas por plataforma en WhatsApp y la tienda en línea.',
      ],
      niveles: {
        operativo: 'Lanzar un piloto pequeño y medible en TikTok.',
        estrategico: 'Construir una mezcla de canales que no dependa de una sola plataforma.',
        transformacional: 'Convertir las recetas en un activo de contenido propio que alimente todas las redes.',
      },
      preMortem:
        'Seis meses después, las ventas digitales cayeron. El presupuesto se movió antes de tener creativos nativos, TikTok trajo vistas pero pocas conversaciones de compra, y Meta perdió rendimiento al reducirse su inversión. Nadie definió una métrica de corte, así que el error se detectó tarde.',
      argumentoContrario:
        'Meta ya funciona y conoce a la audiencia; recortarlo debilita el canal que sostiene la venta. TikTok premia el contenido orgánico constante más que la pauta, y la marca aún no tiene ese músculo. Sería más sensato probar video corto en Reels, donde la audiencia ya compra.',
      consecuencias:
        'Primer orden: menos alcance en Meta y nuevo alcance en TikTok.\nSegundo orden: Meta puede rendir peor con menos presupuesto y subir el costo por resultado; el equipo dedica más horas a video.\nTercer orden: si funciona, la marca gana una audiencia más joven y menos dependencia de una plataforma; si falla, se pierde un semestre de crecimiento en el canal principal.',
      noEstamosViendo: [
        'Que TikTok convierte igual que Meta para un producto perecedero.',
        'Que no haya forma confiable de atribuir ventas por plataforma.',
        'Un cambio de algoritmo o de reglas publicitarias en TikTok.',
        'Un competidor que gane TikTok con recetas antes que nosotros.',
        'Haber descuidado Meta justo en la temporada alta.',
      ],
      dimensiones: { financiero: 50, estrategico: 72, operacional: 45, reputacional: 62, riesgo: 48, humano: 50 },
      expertos: [
        E('CFO', 'Ajustar', 52, 'Mover Q 12,000 sin regla de corte arriesga el canal que sostiene la venta.', 'Piloto con tope de gasto y evaluación a las 8 semanas.'),
        E('Estratega', 'Avanzar', 74, 'Depender de una sola plataforma es un riesgo de largo plazo.', 'Tratarlo como diversificación estratégica, no como experimento aislado.'),
        E('Director de Riesgos', 'Ajustar', 50, 'Sin atribución no se sabrá si funcionó.', 'Definir la medición antes de invertir el primer quetzal.'),
        E('Asesor Legal', 'Avanzar', 70, 'Uso de música y de imagen de personas en los videos.', 'Usar música con licencia comercial y autorizaciones de imagen.'),
        E('Economista Conductual', 'Ajustar', 55, 'Sesgo de novedad: lo nuevo parece mejor sin evidencia.', 'Fijar de antemano qué resultado haría volver atrás.'),
        E('Director de Operaciones', 'Ajustar', 46, 'El equipo no tiene capacidad para producir video cada semana.', 'Calendario de producción y plantillas antes del lanzamiento.'),
        E('Voz del Mercado', 'Avanzar', 68, 'El cliente quiere ver frescura y recetas fáciles.', 'Mostrar el producto real y una receta en menos de 30 segundos.'),
      ],
      escenarios: [
        { nombre: 'Optimista', probabilidad: 25, impacto: 60, narrativa: 'TikTok iguala el costo por conversación de Meta y abre un público nuevo. Se amplía la inversión con evidencia.' },
        { nombre: 'Base', probabilidad: 50, impacto: 15, narrativa: 'TikTok genera alcance y algunas ventas. Se mantiene con el 10 al 15% del presupuesto como canal complementario.' },
        { nombre: 'Pesimista', probabilidad: 25, impacto: -45, narrativa: 'Mucho alcance, pocas ventas y Meta rinde peor. Se revierte la decisión tras perder parte de la temporada.' },
      ],
      stakeholders: [
        S('Gerencia general', 'Neutral', 85, 60),
        S('Equipo de mercadeo', 'Gana', 40, 85),
        S('Ventas B2C por WhatsApp', 'Pierde', 35, 75),
        S('Clientes de 25 a 40 años', 'Gana', 30, 55),
        S('Proveedor de pauta actual', 'Bloquea', 45, 50),
      ],
      evidencias: [
        V('El presupuesto de pauta es de Q 40,000 al mes.', 'Hecho', 'Decisión', 'Q 12,000 de Q 40,000, cifras simuladas'),
        V('Las ventas B2C llegan por WhatsApp, redes y tienda en línea.', 'Hecho', 'EMPRESA', 'venta B2C por WhatsApp, redes sociales y tienda en línea'),
        V('El equipo tendría dificultad para producir video cada semana.', 'Inferencia', 'EMPRESA', 'Equipo de mercadeo de 3 personas que produce el contenido en casa'),
        V('Los clientes valoran frescura y recetas.', 'Hecho', 'MERCADO', 'los clientes buscan frescura, entrega a domicilio y recetas fáciles'),
        V('TikTok traerá conversaciones de compra a un costo similar a Meta.', 'Supuesto', 'Sin respaldo', ''),
      ],
    },
  },
  {
    id: 'agencia',
    titulo: 'Tercerizar el contenido orgánico',
    area: 'Orgánico',
    monto: 'Q 15,000 al mes (simulado)',
    resultado: 'Reconsiderar',
    input:
      'Evaluamos contratar una agencia externa para producir todo el contenido orgánico de Instagram, Facebook y TikTok por Q 15,000 al mes (cifra simulada), en lugar de seguir produciéndolo con el equipo interno de 3 personas. Queremos subir de 8 a 20 publicaciones al mes y liberar tiempo del equipo para estrategia.',
    result: {
      decision: 'Tercerizar la producción de todo el contenido orgánico con una agencia por Q 15,000 al mes.',
      objetivo: 'Aumentar la frecuencia de publicación y liberar tiempo del equipo para tareas estratégicas.',
      contexto: 'El equipo interno de 3 personas produce hoy 8 publicaciones al mes; la marca compite con supermercados y pescaderías en redes.',
      preguntaSuperior: '¿Qué parte del contenido debe quedarse dentro porque es la voz de la marca, y qué parte se puede escalar afuera?',
      nivel: 'Estratégico',
      alternativas: [
        'Tercerizar todo el contenido (propuesta original).',
        'Modelo mixto: la agencia hace piezas de producción alta y el equipo el día a día y la comunidad.',
        'Contratar un creador de contenido independiente por proyecto.',
        'Sistematizar la producción interna con plantillas e IA antes de contratar.',
      ],
      queTendriaQueSerCierto: [
        'Que la agencia capture el tono y el conocimiento de producto de la marca.',
        'Que más publicaciones se traduzcan en más conversaciones de venta.',
        'Que el equipo use el tiempo liberado en algo de mayor valor.',
        'Que el costo sea sostenible frente al margen de las ventas digitales.',
      ],
      costoOportunidad: 'Q 15,000 al mes podrían financiar más pauta en temporada alta o una persona dedicada a contenido.',
      veredicto: 'Reconsiderar',
      confianza: 54,
      sintesis:
        'El análisis sugiere reconsiderar la tercerización total. Liberar tiempo es un objetivo válido, pero entregar toda la voz de la marca a un tercero arriesga autenticidad y conocimiento de producto, que es lo que diferencia a una empresa de mariscos frente a los supermercados.\n\nUn modelo mixto o la sistematización interna podrían lograr la frecuencia buscada a menor costo. Falta evidencia de que pasar de 8 a 20 publicaciones aumente las ventas.',
      factores: [
        'La autenticidad del contenido es parte del diferencial frente a competidores grandes.',
        'No hay evidencia de que más publicaciones generen más ventas.',
        'El costo mensual es fijo, mientras el beneficio es incierto.',
      ],
      proximosPasos: [
        'Medir durante un mes qué publicaciones generan conversaciones de venta.',
        'Pedir propuesta de modelo mixto a dos agencias o creadores independientes.',
        'Probar plantillas y herramientas de IA para subir la frecuencia interna.',
      ],
      niveles: {
        operativo: 'Subir la frecuencia con plantillas y un calendario editorial.',
        estrategico: 'Definir qué contenido es identidad de marca y debe quedarse dentro.',
        transformacional: 'Convertir a clientes y cocineros en creadores de contenido de la marca.',
      },
      preMortem:
        'Un año después, la agencia publica mucho, pero el contenido se ve genérico, los clientes dejan de comentar y las conversaciones de venta no suben. El equipo perdió práctica en producción y la marca depende de un proveedor para comunicarse.',
      argumentoContrario:
        'El equipo interno ya está saturado y la frecuencia actual es baja; seguir igual también tiene un costo. Una agencia trae capacidad, oficio y constancia que hoy no existen, y el tiempo liberado podría ir a estrategia comercial.',
      consecuencias:
        'Primer orden: más publicaciones y menos carga para el equipo.\nSegundo orden: el tono de marca puede diluirse y aparecen costos de coordinación y revisión.\nTercer orden: dependencia de un proveedor para la comunicación diaria y pérdida de conocimiento interno.',
      noEstamosViendo: [
        'Que más volumen no sea lo que hace vender.',
        'Que la agencia no entienda un producto fresco y perecedero.',
        'Un recorte de presupuesto que obligue a cancelar el contrato.',
        'Un competidor con una voz más auténtica que gane la comunidad.',
        'Haber perdido la capacidad interna de producir contenido.',
      ],
      dimensiones: { financiero: 40, estrategico: 48, operacional: 66, reputacional: 50, riesgo: 46, humano: 58 },
      expertos: [
        E('CFO', 'Ajustar', 45, 'Costo fijo alto sin evidencia de retorno.', 'Contrato de 3 meses con metas de conversación.'),
        E('Estratega', 'Detener', 38, 'La voz de la marca es un activo que no conviene tercerizar completo.', 'Modelo mixto: la identidad dentro, la producción pesada afuera.'),
        E('Director de Riesgos', 'Ajustar', 50, 'Dependencia de un solo proveedor.', 'Cláusulas de propiedad del contenido y de salida.'),
        E('Asesor Legal', 'Avanzar', 66, 'Propiedad intelectual de las piezas.', 'Contrato que ceda los derechos de todo el material.'),
        E('Economista Conductual', 'Ajustar', 52, 'Ilusión de que más volumen es más resultado.', 'Medir conversaciones de venta, no publicaciones.'),
        E('Director de Operaciones', 'Avanzar', 72, 'El equipo interno está saturado.', 'Definir un flujo de aprobación de 48 horas.'),
        E('Voz del Mercado', 'Ajustar', 47, 'El cliente confía en ver a la gente real del negocio.', 'Mantener caras y voces internas en el contenido.'),
      ],
      escenarios: [
        { nombre: 'Optimista', probabilidad: 20, impacto: 45, narrativa: 'La agencia capta el tono, sube la conversación y el equipo gana tiempo para estrategia.' },
        { nombre: 'Base', probabilidad: 50, impacto: 5, narrativa: 'Más publicaciones con impacto modesto en ventas. El costo queda en revisión permanente.' },
        { nombre: 'Pesimista', probabilidad: 30, impacto: -40, narrativa: 'Contenido genérico, poca interacción y un contrato difícil de cortar.' },
      ],
      stakeholders: [
        S('Gerencia general', 'Neutral', 85, 55),
        S('Equipo de mercadeo', 'Gana', 40, 90),
        S('Agencia externa', 'Gana', 30, 80),
        S('Comunidad en redes', 'Neutral', 30, 50),
        S('Finanzas', 'Bloquea', 70, 60),
      ],
      evidencias: [
        V('La agencia costaría Q 15,000 al mes.', 'Hecho', 'Decisión', 'por Q 15,000 al mes (cifra simulada)'),
        V('Hoy se publican 8 piezas al mes.', 'Hecho', 'Decisión', 'subir de 8 a 20 publicaciones al mes'),
        V('El contenido lo produce un equipo interno de 3 personas.', 'Hecho', 'EMPRESA', 'Equipo de mercadeo de 3 personas que produce el contenido en casa'),
        V('La autenticidad diferencia a la marca frente a los supermercados.', 'Inferencia', 'MERCADO', 'compiten supermercados y pescaderías con presencia en redes'),
        V('Pasar a 20 publicaciones aumentará las ventas.', 'Supuesto', 'Sin respaldo', ''),
      ],
    },
  },
  {
    id: 'influencers',
    titulo: 'Microinfluencers en Cuaresma',
    area: 'Pauta e influencers',
    monto: 'Q 25,000 (simulado)',
    resultado: 'Avanzar',
    input:
      'Queremos lanzar una campaña con 5 microinfluencers gastronómicos de Guatemala durante la Cuaresma, con un presupuesto de Q 25,000 (cifra simulada), para aumentar los pedidos B2C por WhatsApp y la tienda en línea en la temporada de mayor demanda.',
    result: {
      decision: 'Lanzar una campaña de Cuaresma con 5 microinfluencers gastronómicos por Q 25,000.',
      objetivo: 'Aumentar los pedidos B2C en la temporada de mayor demanda.',
      contexto: 'La demanda sube con fuerza en Cuaresma y los clientes buscan recetas fáciles y entrega a domicilio.',
      preguntaSuperior: '¿Cómo capturamos la mayor parte posible de la demanda de Cuaresma frente a supermercados y pescaderías?',
      nivel: 'Táctico',
      alternativas: [
        'Campaña con 5 microinfluencers (propuesta original).',
        'Dos influencers de mayor alcance.',
        'Más pauta directa con recetas propias.',
        'Alianza con restaurantes clientes para una promoción conjunta.',
      ],
      queTendriaQueSerCierto: [
        'Que los influencers tengan audiencia real en Guatemala que compre mariscos.',
        'Que haya inventario y capacidad de entrega para el pico de pedidos.',
        'Que cada influencer tenga un código o enlace propio para medir ventas.',
        'Que la campaña arranque antes del pico, no durante.',
      ],
      costoOportunidad: 'Los Q 25,000 dejarían de estar disponibles para pauta adicional en la misma temporada.',
      veredicto: 'Avanzar',
      confianza: 66,
      sintesis:
        'El análisis sugiere avanzar: la Cuaresma concentra la demanda y los microinfluencers gastronómicos aportan confianza y recetas, que es justo lo que el cliente busca. El riesgo principal no está en la idea sino en la ejecución: inventario, entregas y medición.\n\nLa confianza es moderada-alta porque la temporada alta está respaldada por el contexto, pero el rendimiento de cada influencer es desconocido hasta medirlo.',
      factores: [
        'La demanda de Cuaresma está documentada en el contexto.',
        'La medición con códigos por influencer permite decidir con datos.',
        'La capacidad de entrega en el pico define si la campaña suma o daña la reputación.',
      ],
      proximosPasos: [
        'Seleccionar influencers por audiencia local verificada, no por número de seguidores.',
        'Asignar un código de descuento único a cada influencer.',
        'Confirmar inventario y cupos de entrega para las semanas pico.',
      ],
      niveles: {
        operativo: 'Lanzar la campaña con medición por influencer.',
        estrategico: 'Construir una red estable de creadores gastronómicos para todo el año.',
        transformacional: 'Posicionar la marca como referente de recetas de mariscos en Guatemala.',
      },
      preMortem:
        'Terminada la Cuaresma, la campaña generó muchas visitas, pero los pedidos se atrasaron, hubo quejas por entregas y dos influencers resultaron tener audiencia mayormente fuera del país. Como no había códigos, nadie supo qué funcionó.',
      argumentoContrario:
        'En Cuaresma la demanda llega sola; pagar influencers puede ser gastar en ventas que ocurrirían igual. Sería mejor invertir en logística y en pauta directa sobre las búsquedas de la temporada.',
      consecuencias:
        'Primer orden: más alcance y más pedidos durante la temporada.\nSegundo orden: presión sobre inventario y entregas; si fallan, llegan reseñas negativas.\nTercer orden: si funciona, la marca gana una comunidad de recetas que sostiene ventas fuera de temporada.',
      noEstamosViendo: [
        'Que la demanda llegue igual sin la campaña.',
        'Que la audiencia de los influencers no sea local.',
        'Una escasez de producto o un alza de precios del proveedor.',
        'Que un competidor contrate a los mismos influencers.',
        'Haber dañado la reputación por entregas tardías.',
      ],
      dimensiones: { financiero: 64, estrategico: 70, operacional: 52, reputacional: 74, riesgo: 60, humano: 62 },
      expertos: [
        E('CFO', 'Avanzar', 66, 'El retorno es incierto si la demanda llega sola.', 'Medir ventas incrementales con códigos por influencer.'),
        E('Estratega', 'Avanzar', 72, 'La temporada es la mejor ventana para construir comunidad.', 'Mantener la relación con los creadores que mejor rindan.'),
        E('Director de Riesgos', 'Ajustar', 55, 'Pico logístico difícil de absorber.', 'Plan de contingencia de entregas y cupos diarios.'),
        E('Asesor Legal', 'Avanzar', 68, 'El contenido pagado debe identificarse como publicidad.', 'Contrato que exija declarar la colaboración.'),
        E('Economista Conductual', 'Avanzar', 70, 'La recomendación de alguien cercano reduce la desconfianza de comprar mariscos en línea.', 'Mostrar el producto llegando fresco a casa.'),
        E('Director de Operaciones', 'Ajustar', 48, 'Capacidad de despacho limitada en las semanas pico.', 'Cupos de entrega por día y horarios claros.'),
        E('Voz del Mercado', 'Avanzar', 76, 'Los clientes buscan recetas fáciles para la temporada.', 'Recetas tradicionales de Cuaresma en formato corto.'),
      ],
      escenarios: [
        { nombre: 'Optimista', probabilidad: 30, impacto: 65, narrativa: 'Dos o tres influencers rinden muy bien, los pedidos crecen y la entrega responde.' },
        { nombre: 'Base', probabilidad: 50, impacto: 30, narrativa: 'Aumento moderado de pedidos y aprendizaje sobre qué creador funciona mejor.' },
        { nombre: 'Pesimista', probabilidad: 20, impacto: -30, narrativa: 'Mucho alcance con poca venta y quejas por entregas en el pico.' },
      ],
      stakeholders: [
        S('Gerencia general', 'Gana', 85, 60),
        S('Ventas B2C', 'Gana', 40, 85),
        S('Logística y despacho', 'Bloquea', 60, 70),
        S('Microinfluencers', 'Gana', 30, 75),
        S('Clientes de la temporada', 'Gana', 25, 65),
      ],
      evidencias: [
        V('La demanda sube en Cuaresma.', 'Hecho', 'MERCADO', 'la demanda sube con fuerza en Cuaresma'),
        V('El presupuesto de la campaña es de Q 25,000.', 'Hecho', 'Decisión', 'con un presupuesto de Q 25,000 (cifra simulada)'),
        V('Los clientes valoran las recetas fáciles.', 'Hecho', 'MERCADO', 'los clientes buscan frescura, entrega a domicilio y recetas fáciles'),
        V('El pico de pedidos puede saturar las entregas.', 'Inferencia', 'MERCADO', 'entrega a domicilio'),
        V('Los microinfluencers tienen audiencia local que compra.', 'Supuesto', 'Sin respaldo', ''),
      ],
    },
  },
  {
    id: 'whatsapp',
    titulo: 'Catálogo y respuestas automáticas en WhatsApp',
    area: 'Canales digitales',
    monto: 'Sin costo de licencia (simulado)',
    resultado: 'Avanzar con ajustes',
    input:
      'Estamos considerando implementar el catálogo de WhatsApp Business y respuestas automáticas para preguntas frecuentes, para cerrar ventas B2C más rápido. Hoy la jefa de mercadeo responde personalmente los mensajes y arma cotizaciones a mano.',
    result: {
      decision: 'Implementar el catálogo de WhatsApp Business y respuestas automáticas para preguntas frecuentes.',
      objetivo: 'Reducir el tiempo de respuesta y liberar horas sin perder el trato personal.',
      contexto: 'La venta B2C llega por WhatsApp y la atiende una sola persona, que además arma las cotizaciones a mano.',
      preguntaSuperior: '¿Cómo atendemos más pedidos por WhatsApp sin que la venta dependa de una sola persona?',
      nivel: 'Operativo',
      alternativas: [
        'Catálogo y respuestas automáticas (propuesta original).',
        'Solo catálogo, con atención humana en todo.',
        'Plataforma de atención con varios agentes y asistente automático.',
        'Asignar una persona dedicada a WhatsApp.',
      ],
      queTendriaQueSerCierto: [
        'Que precios y disponibilidad del catálogo se mantengan al día.',
        'Que las respuestas automáticas no frustren al cliente.',
        'Que haya una persona responsable de los casos que la automatización no resuelve.',
        'Que el volumen de mensajes justifique el esfuerzo de configurarlo.',
      ],
      costoOportunidad: 'El tiempo de configuración y mantenimiento compite con la producción de contenido.',
      veredicto: 'Avanzar con ajustes',
      confianza: 63,
      sintesis:
        'El análisis sugiere avanzar con ajustes: automatizar preguntas frecuentes y mostrar el catálogo reduce tiempos y libera horas, pero un catálogo desactualizado en un producto fresco daña la confianza. La pregunta de fondo es cómo evitar que la venta dependa de una sola persona.\n\nLa recomendación es empezar por el catálogo y las respuestas a las 10 preguntas más comunes, con un traspaso claro a una persona cuando el cliente lo necesite.',
      factores: [
        'La venta B2C hoy depende de una sola persona.',
        'Precios y disponibilidad cambian, así que el catálogo exige mantenimiento.',
        'El trato personal es parte de la confianza al comprar productos frescos.',
      ],
      proximosPasos: [
        'Listar las 10 preguntas más frecuentes y sus respuestas aprobadas.',
        'Cargar el catálogo con precios vigentes y un responsable de actualizarlo.',
        'Definir en qué momento la conversación pasa a una persona.',
      ],
      niveles: {
        operativo: 'Catálogo y respuestas automáticas para preguntas frecuentes.',
        estrategico: 'Un canal de venta que no dependa de una sola persona.',
        transformacional: 'Pedidos recurrentes y suscripciones gestionadas desde WhatsApp.',
      },
      preMortem:
        'Tres meses después, varios clientes recibieron precios viejos del catálogo, la respuesta automática contestó mal preguntas sobre frescura y algunos dejaron de escribir. Nadie quedó a cargo de actualizar el catálogo.',
      argumentoContrario:
        'El trato personal es lo que hace que la gente confíe en comprar mariscos por mensaje. Automatizar puede enfriar la relación; quizá conviene más una persona dedicada que una respuesta automática.',
      consecuencias:
        'Primer orden: respuestas más rápidas y menos horas de atención manual.\nSegundo orden: aparece la tarea de mantener catálogo y respuestas; los errores se multiplican si no se actualizan.\nTercer orden: la venta escala sin depender de una persona, o la marca pierde calidez si se automatiza de más.',
      noEstamosViendo: [
        'Que el cliente prefiera hablar con una persona.',
        'Que el catálogo quede desactualizado en pocas semanas.',
        'Un cambio en las políticas de WhatsApp Business.',
        'Que un competidor atienda más rápido y con más calidez.',
        'Haber perdido la relación cercana con los clientes frecuentes.',
      ],
      dimensiones: { financiero: 66, estrategico: 64, operacional: 74, reputacional: 56, riesgo: 58, humano: 70 },
      expertos: [
        E('CFO', 'Avanzar', 70, 'Costo bajo frente a las horas que se liberan.', 'Medir horas ahorradas y conversiones del canal.'),
        E('Estratega', 'Avanzar', 66, 'La venta no puede depender de una persona.', 'Diseñarlo como un canal escalable.'),
        E('Director de Riesgos', 'Ajustar', 54, 'Precios desactualizados en el catálogo.', 'Un responsable y una rutina semanal de actualización.'),
        E('Asesor Legal', 'Ajustar', 58, 'Manejo de datos personales de clientes.', 'Aviso de privacidad y no pedir datos innecesarios.'),
        E('Economista Conductual', 'Ajustar', 56, 'Las respuestas frías generan desconfianza.', 'Mensajes con tono humano y opción de hablar con alguien.'),
        E('Director de Operaciones', 'Avanzar', 76, 'Se pierde tiempo en cotizaciones repetidas.', 'Conectar el catálogo con el inventario disponible.'),
        E('Voz del Mercado', 'Ajustar', 55, 'El cliente quiere rapidez y trato cercano a la vez.', 'Responder rápido y pasar a una persona ante dudas de producto.'),
      ],
      escenarios: [
        { nombre: 'Optimista', probabilidad: 30, impacto: 50, narrativa: 'Respuestas inmediatas, más pedidos cerrados y horas liberadas para estrategia.' },
        { nombre: 'Base', probabilidad: 55, impacto: 20, narrativa: 'Menos tiempo en preguntas repetidas; el catálogo exige disciplina para mantenerse al día.' },
        { nombre: 'Pesimista', probabilidad: 15, impacto: -25, narrativa: 'Errores de precio y respuestas frías que alejan a clientes frecuentes.' },
      ],
      stakeholders: [
        S('Jefa de mercadeo', 'Gana', 60, 90),
        S('Clientes B2C', 'Neutral', 30, 70),
        S('Gerencia general', 'Gana', 85, 45),
        S('Bodega e inventario', 'Bloquea', 50, 40),
      ],
      evidencias: [
        V('Una sola persona responde los mensajes.', 'Hecho', 'Decisión', 'la jefa de mercadeo responde personalmente los mensajes'),
        V('Las cotizaciones se arman a mano.', 'Hecho', 'Decisión', 'arma cotizaciones a mano'),
        V('Las ventas B2C llegan por WhatsApp.', 'Hecho', 'EMPRESA', 'venta B2C por WhatsApp, redes sociales y tienda en línea'),
        V('El catálogo exigirá actualización frecuente.', 'Inferencia', 'MERCADO', 'los clientes buscan frescura'),
        V('Las respuestas automáticas no reducirán ventas.', 'Supuesto', 'Sin respaldo', ''),
      ],
    },
  },
  {
    id: 'pausa',
    titulo: 'Pausar la pauta en temporada baja',
    area: 'Pauta',
    monto: 'Q 80,000 de ahorro (simulado)',
    resultado: 'Detener',
    input:
      'Proponemos pausar toda la pauta pagada en julio y agosto, que en este caso simulado se consideran temporada baja, y sostener la marca solo con contenido orgánico, para ahorrar Q 80,000 (cifra simulada) y reinvertirlos en Cuaresma.',
    result: {
      decision: 'Pausar toda la pauta pagada en julio y agosto y reinvertir el ahorro en Cuaresma.',
      objetivo: 'Concentrar el presupuesto en la temporada de mayor demanda.',
      contexto: 'Julio y agosto se asumen como temporada baja; la demanda sube con fuerza en Cuaresma.',
      preguntaSuperior: '¿Cómo distribuimos el presupuesto del año para maximizar las ventas totales, no solo las de temporada alta?',
      nivel: 'Estratégico',
      alternativas: [
        'Pausar toda la pauta (propuesta original).',
        'Reducir la pauta al 40% y mantener remarketing a clientes actuales.',
        'Mantener solo campañas de conversación a WhatsApp y remarketing.',
        'Usar la temporada baja para campañas dirigidas a restaurantes (B2B).',
      ],
      queTendriaQueSerCierto: [
        'Que la demanda de julio y agosto no responda a la pauta.',
        'Que el contenido orgánico mantenga el contacto con la audiencia.',
        'Que reactivar la pauta antes de Cuaresma no tenga un costo de arranque alto.',
        'Que la competencia no aproveche el espacio libre.',
      ],
      costoOportunidad: 'Se renuncia a dos meses de ventas y de aprendizaje de los algoritmos de pauta.',
      veredicto: 'Detener',
      confianza: 57,
      sintesis:
        'El análisis sugiere no pausar toda la pauta. Concentrar recursos en Cuaresma tiene lógica, pero apagar por completo corta las ventas de temporada baja, enfría las audiencias de remarketing y obliga a reaprender los algoritmos justo antes del pico. La pregunta de fondo es cómo distribuir el presupuesto anual.\n\nUna reducción parcial que mantenga el remarketing protege la base de clientes y libera buena parte del presupuesto para la temporada alta.',
      factores: [
        'Apagar por completo elimina el remarketing a clientes actuales.',
        'Reactivar campañas desde cero antes del pico suele costar más.',
        'El caso no trae evidencia de que la temporada baja no responda a la pauta.',
      ],
      proximosPasos: [
        'Revisar las ventas de julio y agosto del año anterior por canal.',
        'Reducir la pauta al 40% manteniendo el remarketing.',
        'Definir el presupuesto de Cuaresma con una meta de ventas incrementales.',
      ],
      niveles: {
        operativo: 'Reducir, no apagar, la pauta en temporada baja.',
        estrategico: 'Plan de presupuesto anual por temporada con metas por canal.',
        transformacional: 'Productos o promociones que generen demanda fuera de temporada.',
      },
      preMortem:
        'En septiembre, las ventas digitales cayeron más de lo esperado, las audiencias de remarketing se vaciaron y la pauta de Cuaresma arrancó cara y lenta. Lo ahorrado se fue en recuperar terreno.',
      argumentoContrario:
        'Si la temporada baja realmente vende poco, cada quetzal ahí rinde menos que en Cuaresma. Concentrar recursos donde está la demanda es disciplina, y el contenido orgánico puede sostener la marca dos meses.',
      consecuencias:
        'Primer orden: ahorro inmediato y menos ventas pagadas en julio y agosto.\nSegundo orden: las audiencias de remarketing se enfrían y el costo por resultado sube al reactivar.\nTercer orden: la competencia gana visibilidad y la marca pierde recordación entre temporadas.',
      noEstamosViendo: [
        'Que la temporada baja sí responda a la pauta.',
        'Que el contenido orgánico no alcance a la audiencia.',
        'Un aumento del costo de la pauta justo en Cuaresma.',
        'Un competidor que ocupe el espacio que dejamos libre.',
        'Haber perdido clientes recurrentes en esos dos meses.',
      ],
      dimensiones: { financiero: 55, estrategico: 38, operacional: 60, reputacional: 42, riesgo: 35, humano: 55 },
      expertos: [
        E('CFO', 'Ajustar', 58, 'El ahorro es real, pero se pierden ventas.', 'Recorte parcial con una meta mínima de ventas.'),
        E('Estratega', 'Detener', 34, 'Desaparecer dos meses debilita la marca.', 'Plan anual con presencia mínima todo el año.'),
        E('Director de Riesgos', 'Detener', 36, 'Reactivar campañas justo antes del pico es costoso.', 'Mantener el remarketing activo.'),
        E('Asesor Legal', 'Avanzar', 70, 'No hay un riesgo legal relevante.', 'No se requiere ninguna acción legal.'),
        E('Economista Conductual', 'Ajustar', 45, 'Lo que no se ve se olvida.', 'Mantener una frecuencia mínima de contacto.'),
        E('Director de Operaciones', 'Avanzar', 64, 'Menos carga de gestión de campañas.', 'Usar ese tiempo para preparar la Cuaresma.'),
        E('Voz del Mercado', 'Detener', 40, 'Los clientes recurrentes compran todo el año.', 'Ofertas para clientes frecuentes en temporada baja.'),
      ],
      escenarios: [
        { nombre: 'Optimista', probabilidad: 20, impacto: 30, narrativa: 'Las ventas de temporada baja casi no cambian y el ahorro potencia la Cuaresma.' },
        { nombre: 'Base', probabilidad: 45, impacto: -10, narrativa: 'Caen las ventas de julio y agosto y la reactivación cuesta más de lo previsto.' },
        { nombre: 'Pesimista', probabilidad: 35, impacto: -50, narrativa: 'Se pierden clientes recurrentes y la competencia ocupa el espacio libre.' },
      ],
      stakeholders: [
        S('Gerencia y finanzas', 'Gana', 85, 70),
        S('Equipo de mercadeo', 'Neutral', 40, 80),
        S('Ventas B2C', 'Pierde', 35, 85),
        S('Clientes recurrentes', 'Pierde', 25, 50),
        S('Proveedor de pauta', 'Neutral', 30, 40),
      ],
      evidencias: [
        V('El ahorro sería de Q 80,000.', 'Hecho', 'Decisión', 'para ahorrar Q 80,000 (cifra simulada)'),
        V('La demanda sube en Cuaresma.', 'Hecho', 'MERCADO', 'la demanda sube con fuerza en Cuaresma'),
        V('Julio y agosto son temporada baja.', 'Supuesto', 'Decisión', 'que en este caso simulado se consideran temporada baja'),
        V('La competencia aprovecharía el espacio libre en redes.', 'Inferencia', 'MERCADO', 'compiten supermercados y pescaderías con presencia en redes'),
        V('El contenido orgánico bastará para sostener la marca.', 'Supuesto', 'Sin respaldo', ''),
      ],
    },
  },
];
