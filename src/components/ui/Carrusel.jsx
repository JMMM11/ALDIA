import { useId } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useCarrusel } from './useCarrusel.js';
import ControlesCarrusel from './ControlesCarrusel.jsx';
import css from './Carrusel.module.css';

// Carrusel accesible (patrón WAI-ARIA): flechas del teclado, swipe, puntos,
// pausa del paso automático y cambio con fundido cruzado.
export default function Carrusel({ items, etiqueta, intervalo = 0, renderItem, etiquetas, className = '' }) {
  const c = useCarrusel(items.length, { intervalo });
  const id = useId();
  const item = items[c.indice];

  return (
    <section
      className={`${css.carrusel} ${className}`}
      aria-roledescription="carrusel"
      aria-label={etiqueta}
      {...c.raiz}
    >
      <div id={id} className={css.pista} aria-live={c.corriendo ? 'off' : 'polite'} {...c.deslizar}>
        <AnimatePresence initial={false}>
          <motion.div
            key={c.indice}
            className={css.slide}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${c.indice + 1} de ${items.length}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderItem(item, c.indice)}
          </motion.div>
        </AnimatePresence>
      </div>
      <ControlesCarrusel c={c} total={items.length} etiquetas={etiquetas} idGrupo={id} />
    </section>
  );
}
