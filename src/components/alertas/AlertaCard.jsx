import { motion } from 'motion/react';
import { Clock, UsersThree } from '@phosphor-icons/react';
import { nombreSector, tipoPorId } from '../../data/catalogos.js';
import { haceCuanto } from '../../lib/tiempo.js';
import { ICONO_TIPO } from '../iconos.js';
import EstadoBadge from '../ui/EstadoBadge.jsx';
import VotoBotones from './VotoBotones.jsx';
import css from './AlertaCard.module.css';

export const tituloAlerta = (a) => `${tipoPorId(a.tipo).nombre} en ${nombreSector(a.sector)}`;

// El título comparte layoutId con el del detalle: al abrirlo, "viaja" hasta el diálogo.
export default function AlertaCard({ alerta, onAbrir, ahora }) {
  const Icono = ICONO_TIPO[alerta.tipo];
  const n = alerta.confirmaciones;

  return (
    <article className={css.tarjeta} data-nivel={alerta.nivel}>
      <div className={css.cabecera}>
        <span className={css.tipo}>
          <Icono weight="duotone" aria-hidden="true" />
          {tipoPorId(alerta.tipo).corto}
        </span>
        <EstadoBadge nivel={alerta.nivel} />
      </div>

      <motion.h3 layoutId={`titulo-${alerta.id}`} className={css.titulo}>
        <button type="button" className={css.abrir} onClick={() => onAbrir(alerta.id)} aria-haspopup="dialog">
          {tituloAlerta(alerta)}
        </button>
      </motion.h3>

      <p className={css.descripcion}>{alerta.descripcion}</p>

      <div className={css.meta}>
        <span>
          <Clock aria-hidden="true" />
          <time dateTime={alerta.creadoEn}>{haceCuanto(alerta.creadoEn, ahora)}</time>
        </span>
        <span className={css.confirmaciones}>
          <UsersThree weight="bold" aria-hidden="true" />
          {n} {n === 1 ? 'confirmación' : 'confirmaciones'}
        </span>
        {alerta.ejemplo && <span className="ejemplo">Ejemplo</span>}
      </div>

      <VotoBotones alerta={alerta} />
    </article>
  );
}
