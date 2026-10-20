// Los 4 niveles del semáforo. El nivel real de cada alerta lo calcula la base de
// datos (vista public.alertas); este archivo solo describe cada nivel.
export const NIVELES = [
  {
    nivel: 1,
    id: 'reportado',
    nombre: 'Reportado',
    corto: 'Reportado',
    regla: 'Una persona lo reportó.',
    efecto: 'Todavía no se difunde. Queda a la vista para que otros vecinos lo confirmen o lo desmientan.',
    siguiente: 'Pasa a "En confirmación" cuando dos vecinos distintos lo confirman en menos de 30 minutos.',
  },
  {
    nivel: 2,
    id: 'en-confirmacion',
    nombre: 'En confirmación',
    corto: 'En confirmación',
    regla: 'Dos vecinos distintos, que no son quien reportó, lo confirman en menos de 30 minutos.',
    efecto: 'Aparece en Alertas activas para que más gente cercana lo revise.',
    siguiente: 'Pasa a "Confirmado" con tres o más confirmaciones, o si lo valida un moderador del sector.',
  },
  {
    nivel: 3,
    id: 'confirmado',
    nombre: 'Confirmado por la comunidad',
    corto: 'Confirmado',
    regla: 'Tres o más confirmaciones, o lo valida un moderador del sector.',
    efecto: 'Se puede difundir en el grupo del sector con tranquilidad.',
    siguiente: 'Pasa a "Oficial" si un moderador encuentra el aviso de SINAPROC, el IDAAN o el Municipio.',
  },
  {
    nivel: 4,
    id: 'oficial',
    nombre: 'Oficial',
    corto: 'Oficial',
    regla: 'Un moderador lo marca como respaldado por SINAPROC, el IDAAN o el Municipio.',
    efecto: 'Muestra el enlace a la fuente oficial para que cualquiera lo verifique.',
    siguiente: null,
  },
];

export const nivelPorNumero = (n) => NIVELES[Math.min(Math.max(n, 1), 4) - 1];

export const REGLAS = [
  {
    id: 'un-voto',
    titulo: 'Una persona, un voto',
    texto: 'Cada teléfono tiene una identidad anónima. La base de datos no deja votar dos veces el mismo reporte.',
  },
  {
    id: 'propio',
    titulo: 'Nadie confirma lo suyo',
    texto: 'Quien reporta no cuenta como confirmación. Hacen falta vecinos distintos.',
  },
  {
    id: 'falso',
    titulo: '"Esto es falso" también cuenta',
    texto: 'Si los votos de falso superan a las confirmaciones, el reporte baja un nivel.',
  },
  {
    id: 'caduca',
    titulo: 'Las alertas caducan',
    texto: 'Si nadie la confirma en 2 horas, la alerta se archiva sola para no alarmar con información vieja.',
  },
];
