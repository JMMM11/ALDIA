import { motion } from 'motion/react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import css from './ControlesCarrusel.module.css';

export default function ControlesCarrusel({ c, total, etiquetas, sobreFoto = false, idGrupo }) {
  return (
    <div className={`${css.controles} ${sobreFoto ? css.sobreFoto : ''}`}>
      <button type="button" className={css.boton} onClick={c.anterior} aria-label="Anterior" aria-controls={idGrupo}>
        <CaretLeft weight="bold" aria-hidden="true" />
      </button>
      <div className={css.puntos}>
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            type="button"
            className={css.punto}
            onClick={() => c.ir(i)}
            aria-label={etiquetas?.[i] ? `Ir a: ${etiquetas[i]}` : `Ir a la diapositiva ${i + 1}`}
            aria-current={i === c.indice ? 'true' : undefined}
            aria-controls={idGrupo}
          >
            {i === c.indice && (
              <motion.span layoutId={`punto-${idGrupo}`} className={css.activo} transition={{ duration: 0.3 }} />
            )}
          </button>
        ))}
      </div>
      <button type="button" className={css.boton} onClick={c.siguiente} aria-label="Siguiente" aria-controls={idGrupo}>
        <CaretRight weight="bold" aria-hidden="true" />
      </button>
    </div>
  );
}
