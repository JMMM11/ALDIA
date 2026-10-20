import { useEffect, useRef } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react';

// Número que cuenta desde cero al entrar en pantalla. Usa un valor de Motion
// (no estado de React) para no volver a renderizar en cada cuadro.
export default function Contador({ valor }) {
  const ref = useRef(null);
  const enVista = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reducir = useReducedMotion();
  const cuenta = useMotionValue(0);
  const texto = useTransform(cuenta, (v) => Math.round(v).toLocaleString('es-PA'));

  useEffect(() => {
    if (!enVista || valor == null) return;
    if (reducir) {
      cuenta.set(valor);
      return;
    }
    const control = animate(cuenta, valor, { duration: 0.9, ease: [0.22, 1, 0.36, 1] });
    return () => control.stop();
  }, [enVista, valor, reducir, cuenta]);

  return (
    <span ref={ref}>
      <motion.span aria-hidden="true">{texto}</motion.span>
      <span className="visualmente-oculto">{valor?.toLocaleString('es-PA')}</span>
    </span>
  );
}
