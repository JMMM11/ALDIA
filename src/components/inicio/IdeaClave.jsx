import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { SITIO } from '../../data/sitio.js';
import { useDatos } from '../../context/DatosContext.jsx';
import Contador from '../ui/Contador.jsx';
import css from './IdeaClave.module.css';

// Cada palabra se enciende a medida que se lee: la frase se "construye"
// igual que una alerta, pieza por pieza. El mínimo de 0.62 mantiene el texto
// "apagado" por encima del contraste AA en ambos temas.
function Palabra({ children, progreso, rango }) {
  const opacidad = useTransform(progreso, rango, [0.62, 1]);
  return <motion.span style={{ opacity: opacidad }}>{children} </motion.span>;
}

export default function IdeaClave() {
  const ref = useRef(null);
  const reducir = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const { estadisticas, conEjemplos } = useDatos();
  const palabras = SITIO.ideaClave.split(' ');

  return (
    <section className={`seccion ${css.seccion}`} aria-labelledby="idea-clave">
      <div className={`contenedor ${css.rejilla}`}>
        <div>
          <h2 id="idea-clave" className="visualmente-oculto">
            La idea clave de FLUYA
          </h2>
          <p ref={ref} className={css.frase}>
            {reducir
              ? SITIO.ideaClave
              : palabras.map((p, i) => (
                  <Palabra key={i} progreso={scrollYProgress} rango={[i / palabras.length, (i + 1) / palabras.length]}>
                    {p}
                  </Palabra>
                ))}
          </p>
        </div>

        <div className={css.cifras}>
          <dl className={css.cifras}>
            <div className={css.cifra}>
              <dt>Alertas confirmadas por vecinos</dt>
              <dd>
                <Contador valor={estadisticas?.alertasConfirmadas} />
              </dd>
            </div>
            <div className={css.cifra}>
              <dt>Vecinos participando</dt>
              <dd>
                <Contador valor={estadisticas?.vecinos} />
              </dd>
            </div>
          </dl>
          {conEjemplos && <span className={`ejemplo ${css.marca}`}>Incluye cifras de ejemplo</span>}
        </div>
      </div>
    </section>
  );
}
