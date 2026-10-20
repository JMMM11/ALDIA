// Contenido de las páginas informativas.

export const RUTAS_ALTERNAS = [
  {
    id: 'panamericana',
    nombre: 'Carretera Panamericana',
    texto: 'Corre en paralelo a la autopista Arraiján-La Chorrera. Es más lenta, pero sirve cuando la autopista está cerrada.',
  },
  {
    id: 'internas',
    nombre: 'Calles internas hacia el hospital',
    texto: 'Los moderadores publican qué calles están pasables para llegar al Hospital Nicolás A. Solano según dónde haya agua.',
  },
  {
    id: 'esperar',
    nombre: 'Esperar también es una ruta',
    texto: 'Si hay crecida, no cruces calles con corriente. Unos centímetros de agua en movimiento bastan para arrastrar a una persona.',
  },
];

export const PASOS_TRASLADO = [
  {
    id: 'pides',
    titulo: 'Pides el traslado',
    texto: 'Llenas el formulario con tu sector y lo que necesitas. Sin nombre ni teléfono.',
  },
  {
    id: 'revisa',
    titulo: 'Un moderador lo revisa',
    texto: 'Solo el moderador de tu sector ve la solicitud. No se publica en Alertas.',
  },
  {
    id: 'conecta',
    titulo: 'Te conecta',
    texto: 'Te responde aquí mismo con un punto de encuentro y quién puede llevarte.',
  },
];

// Puntos de distribución ficticios: siempre marcados como "Ejemplo".
export const PUNTOS_AGUA = [
  { id: 'p1', sector: 'villa-del-campo', lugar: 'Frente a la casa comunal', horario: '3:00 a 6:00 p. m.' },
  { id: 'p2', sector: 'valle-dorado', lugar: 'Entrada principal, junto a la parada', horario: '4:00 a 7:00 p. m.' },
  { id: 'p3', sector: 'martin-sanchez', lugar: 'Cancha del sector', horario: '2:00 a 5:00 p. m.' },
];

export const CONSEJOS_AGUA = [
  'Guarda agua en recipientes limpios y con tapa.',
  'Lava los recipientes antes de volver a llenarlos.',
  'Si el agua sale turbia después del corte, déjala correr unos minutos antes de usarla.',
  'Comparte solo avisos confirmados: un audio sin fuente puede vaciar las tiendas de agua embotellada.',
];

export const VERIFICAR = [
  { id: 'quien', pregunta: '¿Quién lo dice?', texto: 'Un audio sin nombre ni fecha no es una fuente.' },
  { id: 'cuando', pregunta: '¿Cuándo pasó?', texto: 'Las fotos de crecidas viejas vuelven a circular cada vez que llueve.' },
  { id: 'otros', pregunta: '¿Alguien más lo confirma?', texto: 'Busca la alerta en ALDÍA y revisa su nivel en el semáforo.' },
  { id: 'oficial', pregunta: '¿Hay aviso oficial?', texto: 'Revisa las cuentas de SINAPROC, el IDAAN o el Municipio antes de reenviar.' },
];

export const DATOS_PERSONALES = [
  'No publiques tu número de teléfono ni tu dirección exacta.',
  'Evita fotos donde se vean placas, caras de niños o la fachada de tu casa.',
  'Nadie legítimo te pide el código de verificación de WhatsApp. No lo compartas.',
  'ALDÍA no te pide nombre ni teléfono: participas con una identidad anónima.',
];

export const EQUIPO = [
  { id: 'jair', nombre: 'Jair Morales', rol: 'Líder del proyecto y desarrollo web', iniciales: 'JM' },
  { id: 'josh', nombre: 'Josh Amaya', rol: 'Diseño gráfico: logo e infografía', iniciales: 'JA' },
  { id: 'antony', nombre: 'Antony Ortiz', rol: 'Redacción y contenido', iniciales: 'AO' },
];

export const ALIADOS = [
  {
    id: 'sinaproc',
    nombre: 'SINAPROC',
    texto: 'Proponemos que los moderadores enlacen sus avisos para que una alerta pase a "Oficial".',
  },
  {
    id: 'idaan',
    nombre: 'IDAAN',
    texto: 'Sus avisos de cortes y de trabajos en la potabilizadora Jaime Díaz Quintero son la fuente oficial de agua.',
  },
  {
    id: 'municipio',
    nombre: 'Municipio de La Chorrera',
    texto: 'Proponemos coordinar con las juntas comunales la designación de moderadores por sector.',
  },
];
