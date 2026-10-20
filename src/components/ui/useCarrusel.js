import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

// Lógica compartida por todos los carruseles: paso automático (con pausa),
// flechas del teclado y deslizar con el dedo.
export function useCarrusel(total, { intervalo = 0 } = {}) {
  const [indice, setIndice] = useState(0);
  const [pausadoPorUsuario, setPausadoPorUsuario] = useState(false);
  const [interactuando, setInteractuando] = useState(false);
  const reducir = useReducedMotion();
  const automatico = intervalo > 0 && !reducir;
  const corriendo = automatico && !pausadoPorUsuario && !interactuando;

  const ir = useCallback((n) => setIndice(((n % total) + total) % total), [total]);
  const siguiente = useCallback(() => setIndice((i) => (i + 1) % total), [total]);
  const anterior = useCallback(() => setIndice((i) => (i - 1 + total) % total), [total]);

  useEffect(() => {
    if (!corriendo) return;
    const t = setTimeout(siguiente, intervalo);
    return () => clearTimeout(t);
  }, [corriendo, indice, intervalo, siguiente]);

  const inicioX = useRef(null);
  const raiz = {
    onKeyDown: (e) => {
      if (e.key === 'ArrowRight') siguiente();
      else if (e.key === 'ArrowLeft') anterior();
      else return;
      e.preventDefault();
    },
    onPointerEnter: (e) => e.pointerType === 'mouse' && setInteractuando(true),
    onPointerLeave: (e) => e.pointerType === 'mouse' && setInteractuando(false),
    onFocus: () => setInteractuando(true),
    onBlur: (e) => {
      if (!e.currentTarget.contains(e.relatedTarget)) setInteractuando(false);
    },
  };
  const deslizar = {
    onPointerDown: (e) => {
      inicioX.current = e.clientX;
    },
    onPointerUp: (e) => {
      if (inicioX.current === null) return;
      const dx = e.clientX - inicioX.current;
      inicioX.current = null;
      if (Math.abs(dx) > 48) (dx < 0 ? siguiente : anterior)();
    },
    onPointerCancel: () => {
      inicioX.current = null;
    },
  };

  return {
    indice,
    ir,
    siguiente,
    anterior,
    automatico,
    corriendo,
    pausado: pausadoPorUsuario,
    alternarPausa: () => setPausadoPorUsuario((p) => !p),
    raiz,
    deslizar,
  };
}
