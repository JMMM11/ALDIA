import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import css from './Contador.module.css';

const ALTO = 1.1; // alto de cada cifra en em (igual que .tira > span)
const CIFRAS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// Contador mecánico: cada dígito es una tira 0-9 (dos vueltas) que rueda hasta
// su valor al entrar en pantalla. Si la cifra cambia en vivo, la tira rueda al
// dígito nuevo. Con "reducir movimiento" MotionConfig lo deja quieto.
function Digito({ d, visible, orden }) {
  return (
    <span className={css.ventana}>
      <motion.span
        className={css.tira}
        initial={{ y: 0 }}
        animate={{ y: visible ? `${-(d + 10) * ALTO}em` : 0 }}
        transition={{ type: 'spring', stiffness: 38, damping: 13, delay: orden * 0.12 }}
      >
        {[...CIFRAS, ...CIFRAS].map((n, i) => (
          <span key={i}>{n}</span>
        ))}
      </motion.span>
    </span>
  );
}

export default function Contador({ valor }) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const texto = (valor ?? 0).toLocaleString('es-PA');

  return (
    <span ref={ref}>
      <span aria-hidden="true" className={css.cifras}>
        {/* La clave cuenta desde la derecha: las unidades siguen siendo las unidades si la cifra crece */}
        {[...texto].map((c, i) =>
          /\d/.test(c) ? (
            <Digito key={texto.length - i} d={Number(c)} visible={visible} orden={i} />
          ) : (
            <span key={`s${texto.length - i}`}>{c}</span>
          ),
        )}
      </span>
      <span className="visualmente-oculto">{valor?.toLocaleString('es-PA')}</span>
    </span>
  );
}
