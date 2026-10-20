import { Fragment, useEffect, useState } from 'react';
import { Link } from 'wouter';
import { AnimatePresence, motion } from 'motion/react';
import { SLIDES_HERO } from '../../data/inicio.js';
import { SITIO } from '../../data/sitio.js';
import { useReporte } from '../../context/ReporteContext.jsx';
import { useCarrusel } from '../ui/useCarrusel.js';
import ControlesCarrusel from '../ui/ControlesCarrusel.jsx';
import Foto from '../ui/Foto.jsx';
import TarjetaFlotante from './TarjetaFlotante.jsx';
import css from './Hero.module.css';

const ID_MENSAJES = 'hero-mensajes';

// index.html trae una vista previa estática del hero (fuera de #root) con la
// primera foto ya pintada. El hero la reutiliza como fondo de la primera
// diapositiva en vez de crear otra imagen igual: así el LCP es la foto que llegó
// con el HTML. En ese primer montaje el título tampoco repite su entrada.
const previo = document.getElementById('hero-previo');
let vieneDeVistaPrevia = Boolean(previo);

function useVistaPrevia() {
  useEffect(() => {
    if (!previo) return;
    previo.classList.add('montado');
    previo.style.display = '';
    return () => {
      previo.style.display = 'none';
    };
  }, []);
}

// Precarga las demás fotos cuando el navegador está libre, para que el
// fundido nunca muestre un hueco.
function usePrecargarFotos() {
  useEffect(() => {
    const movil = window.matchMedia('(max-width: 700px)').matches;
    const id = setTimeout(() => {
      SLIDES_HERO.slice(1).forEach(({ foto }) => {
        new Image().src = (movil ? foto.movil : foto.grande).src;
      });
    }, 2500);
    return () => clearTimeout(id);
  }, []);
}

function TituloAnimado({ texto, animar }) {
  const palabras = texto.split(' ');
  return (
    <h1 className={css.titulo} aria-label={texto}>
      {palabras.map((p, i) => (
        <Fragment key={i}>
          <span className={css.mascara} aria-hidden="true">
            {/* Entra desenfocada pero ya visible: el texto cuenta como pintado desde
                el primer cuadro y la animación no retrasa el LCP. */}
            <motion.span
              className={css.palabra}
              initial={animar ? { y: '0.4em', opacity: 0.3, filter: 'blur(8px)' } : false}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              {p}
            </motion.span>
          </span>
          {i < palabras.length - 1 && ' '}
        </Fragment>
      ))}
    </h1>
  );
}

export default function Hero() {
  const c = useCarrusel(SLIDES_HERO.length, { intervalo: 6500 });
  const { abrirReporte } = useReporte();
  const slide = SLIDES_HERO[c.indice];
  usePrecargarFotos();
  useVistaPrevia();
  const usaPrevio = previo && slide.id === SLIDES_HERO[0].id;
  const [animarTitulo] = useState(!vieneDeVistaPrevia);
  useEffect(() => {
    vieneDeVistaPrevia = false;
  }, []);

  return (
    <section className={`${css.hero} ${previo ? css.sobrePrevio : ''}`} aria-roledescription="carrusel" aria-label="Presentación de ALDÍA" {...c.raiz}>
      <div className={css.fondo} {...c.deslizar}>
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.id}
            className={css.capa}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {/* Acercamiento lento (Ken Burns): da vida a la foto sin distraer.
                Con la vista previa, la primera foto ya está debajo y no se repite. */}
            {!usaPrevio && (
              <motion.div className={css.capa} initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 8, ease: 'linear' }}>
                <Foto foto={slide.foto} prioridad={c.indice === 0} className={css.foto} sizes="100vw" />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
        <div className={css.velo} />
      </div>

      <div className={`contenedor ${css.contenido}`}>
        <div className={css.texto}>
          <TituloAnimado texto={`${SITIO.eslogan}.`} animar={animarTitulo} />

          <div id={ID_MENSAJES} className={css.mensajes} aria-live={c.corriendo ? 'off' : 'polite'}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={slide.id}
                className={css.mensaje}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {slide.mensaje}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.div
            className={css.ctas}
            initial={animarTitulo ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.55 }}
          >
            <button type="button" className="btn btn-accion" onClick={() => abrirReporte()}>
              Reportar
            </button>
            <Link to="/alertas" className="btn btn-sobre-foto">
              Ver alertas
            </Link>
          </motion.div>

          <ControlesCarrusel
            c={c}
            total={SLIDES_HERO.length}
            etiquetas={SLIDES_HERO.map((s) => s.mensaje)}
            idGrupo={ID_MENSAJES}
            sobreFoto
          />
        </div>

        <TarjetaFlotante className={css.tarjeta} />
      </div>
    </section>
  );
}
