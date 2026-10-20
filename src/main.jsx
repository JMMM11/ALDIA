// Punto de entrada mínimo. En la portada, index.html trae una vista previa del
// hero con su foto; la aplicación se descarga recién cuando el navegador avisa
// que esa foto ya se pintó, para que no compitan. Máximo 1,5 s de espera.
const arrancar = () => import('./arranque.jsx');
const previo = document.getElementById('hero-previo');
const avisaPintura = PerformanceObserver.supportedEntryTypes?.includes('largest-contentful-paint');

if (previo && avisaPintura) {
  let arrancado = false;
  const unaVez = () => {
    if (arrancado) return;
    arrancado = true;
    observador.disconnect();
    arrancar();
  };
  const observador = new PerformanceObserver((lista) => {
    if (lista.getEntries().some((e) => e.element?.tagName === 'IMG' && previo.contains(e.element))) unaVez();
  });
  observador.observe({ type: 'largest-contentful-paint', buffered: true });
  setTimeout(unaVez, 1500);
} else if (document.readyState === 'complete') {
  arrancar();
} else {
  window.addEventListener('load', arrancar, { once: true });
}
