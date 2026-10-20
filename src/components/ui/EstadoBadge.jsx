import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { nivelPorNumero } from '../../data/semaforo.js';
import { ICONO_NIVEL } from '../iconos.js';
import css from './EstadoBadge.module.css';

// Insignia del semáforo: siempre ícono + texto, nunca solo color.
// Cuando el nivel sube (llega una confirmación) el contenido cambia con un
// pequeño salto y un pulso, para que se note sin interrumpir la lectura.
export default function EstadoBadge({ nivel, grande = false }) {
  const info = nivelPorNumero(nivel);
  const Icono = ICONO_NIVEL[info.id];
  const anterior = useRef(nivel);
  const subio = nivel > anterior.current;
  useEffect(() => {
    anterior.current = nivel;
  }, [nivel]);

  return (
    <motion.span layout="position" className={`${css.badge} ${grande ? css.grande : ''}`} data-nivel={info.nivel}>
      {subio && (
        <motion.span
          key={`pulso-${nivel}`}
          className={css.pulso}
          aria-hidden="true"
          initial={{ opacity: 0.7, scale: 1 }}
          animate={{ opacity: 0, scale: 1.6 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      )}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={info.id}
          className={css.contenido}
          initial={{ opacity: 0, y: 8, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        >
          <Icono weight="bold" aria-hidden="true" className={css.icono} />
          {grande ? info.nombre : info.corto}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
