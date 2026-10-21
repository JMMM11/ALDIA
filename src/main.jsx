// Punto de entrada. La aplicación se importa de forma estática para que Vite
// la precargue desde el HTML y la página quede completa (menú, botones,
// secciones) apenas carga, sin esperar a que se pinte la foto del inicio.

// Si se publicó una versión nueva mientras la página estaba abierta, los
// fragmentos viejos ya no existen: se recarga para traer los nuevos.
window.addEventListener('vite:preloadError', () => window.location.reload());

import './arranque.jsx';
