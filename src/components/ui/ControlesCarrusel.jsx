import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import Icono from './Icono.jsx';
import css from './ControlesCarrusel.module.css';

export default function ControlesCarrusel({ c, total, etiquetas, sobreFoto = false, idGrupo }) {
  return (
    <div className={`${css.controles} ${sobreFoto ? css.sobreFoto : ''}`}>
      <button type="button" className={css.boton} onClick={c.anterior} aria-label="Anterior" aria-controls={idGrupo}>
        <Icono de={ChevronLeft} mov="atras" entrada={false} />
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
        <Icono de={ChevronRight} mov="empujar" entrada={false} />
      </button>
    </div>
  );
}
