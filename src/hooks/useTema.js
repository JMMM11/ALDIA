import { useSyncExternalStore } from 'react';

// El tema vive en <html data-theme>. index.html lo fija antes de pintar.
const EVENTO = 'aldia-tema';
const suscribir = (cb) => {
  window.addEventListener(EVENTO, cb);
  return () => window.removeEventListener(EVENTO, cb);
};
const leer = () => document.documentElement.dataset.theme;

export function useTema() {
  const tema = useSyncExternalStore(suscribir, leer);
  const alternar = () => {
    const nuevo = tema === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nuevo;
    try {
      localStorage.setItem('aldia-tema', nuevo);
    } catch {
      // Navegación privada: el tema dura solo esta visita.
    }
    window.dispatchEvent(new Event(EVENTO));
  };
  return { tema, alternar };
}
