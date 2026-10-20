import { Link } from 'wouter';
import { motion } from 'motion/react';
import { ArrowRight } from '@phosphor-icons/react';
import { NIVELES } from '../../data/semaforo.js';
import { ICONO_NIVEL } from '../iconos.js';
import css from './SemaforoPasos.module.css';

// Los 4 niveles como una secuencia real: la línea se dibuja de izquierda a
// derecha y cada paso aparece cuando la línea lo alcanza.
export default function SemaforoPasos() {
  return (
    <section className={`seccion ${css.seccion}`} aria-labelledby="semaforo">
      <div className="contenedor">
        <h2 id="semaforo" className="titulo-seccion">
          Así se confirma una alerta
        </h2>
        <p className="intro">Ninguna alerta se difunde por lo que diga una sola persona. Sube de nivel cuando la comunidad la respalda.</p>

        <motion.div className={css.caja} initial="oculto" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <motion.span
            className={css.linea}
            aria-hidden="true"
            variants={{
              oculto: { '--progreso': 0 },
              visible: { '--progreso': 1, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
            }}
          />
          <ol className={css.pasos}>
          {NIVELES.map((n, i) => {
            const Icono = ICONO_NIVEL[n.id];
            return (
              <motion.li
                key={n.id}
                className={css.paso}
                data-nivel={n.nivel}
                variants={{
                  oculto: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.15 + i * 0.25 } },
                }}
              >
                <span className={css.icono}>
                  <Icono weight="bold" aria-hidden="true" />
                </span>
                <h3 className={css.nombre}>{n.nombre}</h3>
                <p className={css.regla}>{n.regla}</p>
              </motion.li>
            );
          })}
          </ol>
        </motion.div>

        <Link to="/como-funciona" className="enlace">
          Ver las reglas completas
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
