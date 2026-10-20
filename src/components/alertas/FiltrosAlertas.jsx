import { motion } from 'motion/react';
import { SECTORES, TIPOS } from '../../data/catalogos.js';
import css from './FiltrosAlertas.module.css';

const TODOS = { id: 'todos', nombre: 'Todos' };
const OPCIONES_SECTOR = [TODOS, ...SECTORES];
const OPCIONES_TIPO = [TODOS, ...TIPOS.filter((t) => !t.privado).map((t) => ({ id: t.id, nombre: t.corto }))];

function Grupo({ id, etiqueta, opciones, valor, onCambiar }) {
  return (
    <fieldset className={css.grupo}>
      <legend className={css.leyenda}>{etiqueta}</legend>
      <div className={css.chips}>
        {opciones.map((o) => {
          const activo = valor === o.id;
          return (
            <button key={o.id} type="button" className={css.chip} aria-pressed={activo} onClick={() => onCambiar(o.id)}>
              {activo && (
                <motion.span layoutId={`chip-${id}`} className={css.fondo} transition={{ type: 'spring', stiffness: 500, damping: 38 }} />
              )}
              <span className={css.texto}>{o.nombre}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function FiltrosAlertas({ sector, tipo, onSector, onTipo }) {
  return (
    <div className={css.filtros}>
      <Grupo id="sector" etiqueta="Sector" opciones={OPCIONES_SECTOR} valor={sector} onCambiar={onSector} />
      <Grupo id="tipo" etiqueta="Tipo" opciones={OPCIONES_TIPO} valor={tipo} onCambiar={onTipo} />
    </div>
  );
}
