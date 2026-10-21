import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { CheckCircleFill, Water } from 'react-bootstrap-icons';
import Icono from '../ui/Icono.jsx';
import EstadoBadge from '../ui/EstadoBadge.jsx';
import css from './TarjetaFlotante.module.css';

// Demostración en bucle de cómo sube una alerta por el semáforo.
const PASOS = [
  { nivel: 1, confirmaciones: 0, nota: 'Un vecino lo reporta' },
  { nivel: 1, confirmaciones: 1, nota: 'Llega la primera confirmación' },
  { nivel: 2, confirmaciones: 2, nota: 'Dos vecinos lo confirman en 9 minutos' },
  { nivel: 3, confirmaciones: 3, nota: 'Confirmado: ya se puede difundir' },
  { nivel: 4, confirmaciones: 3, nota: 'Un moderador enlaza el aviso de SINAPROC' },
];

export default function TarjetaFlotante({ className }) {
  const ref = useRef(null);
  const visible = useInView(ref);
  const reducir = useReducedMotion();
  const [paso, setPaso] = useState(reducir ? 3 : 0);
  const actual = PASOS[paso];

  useEffect(() => {
    if (reducir || !visible) return;
    const t = setTimeout(() => setPaso((p) => (p + 1) % PASOS.length), paso === PASOS.length - 1 ? 3800 : 2200);
    return () => clearTimeout(t);
  }, [paso, visible, reducir]);

  return (
    // Ilustración: el semáforo se explica en texto en la sección siguiente.
    <motion.div
      ref={ref}
      className={`${className} ${css.tarjeta}`}
      aria-hidden="true"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={css.cabecera}>
        <span className={css.tipo}>
          <Icono de={Water} mov="ola" />
          Crecida
        </span>
        <span className="ejemplo">Ejemplo</span>
      </div>
      <p className={css.titulo}>Crecida de río en Martín Sánchez</p>
      <EstadoBadge nivel={actual.nivel} grande />

      <div className={css.confirmaciones}>
        <div className={css.puntos}>
          {[0, 1, 2].map((i) => (
            <span key={i} className={css.hueco}>
              <AnimatePresence>
                {i < actual.confirmaciones && (
                  <motion.span
                    className={css.check}
                    initial={{ scale: 0, rotate: -40 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  >
                    <Icono de={CheckCircleFill} mov="latido" />
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          ))}
        </div>
        <span className={css.conteo}>
          {actual.confirmaciones} {actual.confirmaciones === 1 ? 'confirmación' : 'confirmaciones'}
        </span>
      </div>

      <div className={css.notaCaja}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={paso}
            className={css.nota}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {actual.nota}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className={css.progreso}>
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={css.segmento} data-nivel={n}>
            <motion.span
              className={css.relleno}
              initial={false}
              animate={{ scaleX: n <= actual.nivel ? 1 : 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </span>
        ))}
      </div>
    </motion.div>
  );
}
