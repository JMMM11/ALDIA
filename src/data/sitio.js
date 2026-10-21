export const SITIO = {
  nombre: 'FLUYA',
  eslogan: 'Tu comunidad, informada a tiempo',
  ideaClave:
    'La información es confiable porque la comunidad la construye en conjunto, no porque lo diga una sola persona.',
  aviso: 'FLUYA no sustituye a SINAPROC, al IDAAN ni a los servicios de emergencia. Los complementa.',
  emergencia: 'En una emergencia, llama al 911.',
  // Antes del lanzamiento: mezcla alertas y cifras de ejemplo (marcadas
  // "Ejemplo") con las reales para ver todos los estados. Al lanzar, false.
  vistaPrevia: true,
  proyecto:
    'Proyecto N.° 1 de Sistemas Colaborativos, Universidad Tecnológica de Panamá: impacto social del trabajo en equipo a través de las TIC.',
};

// grupo: 'reportes' junta en un menú desplegable todo lo de la aplicación.
export const NAVEGACION = [
  { ruta: '/', nombre: 'Inicio', icono: 'House' },
  { ruta: '/alertas', nombre: 'Alertas', icono: 'Siren', grupo: 'reportes', texto: 'Lo que tus vecinos están viendo ahora' },
  { ruta: '/como-funciona', nombre: 'Cómo funciona', icono: 'Question', grupo: 'reportes', texto: 'Cómo una alerta pasa de reportada a oficial' },
  { ruta: '/traslados', nombre: 'Traslados', icono: 'Path', grupo: 'reportes', texto: 'Pide ayuda para llegar al hospital' },
  { ruta: '/agua', nombre: 'Agua', icono: 'Drop', grupo: 'reportes', texto: 'Cortes del IDAAN y puntos de distribución' },
  { ruta: '/aprende', nombre: 'Aprende', icono: 'BookOpen' },
  { ruta: '/nosotros', nombre: 'Nosotros', icono: 'Users' },
];
