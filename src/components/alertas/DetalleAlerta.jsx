import { motion } from 'motion/react';
import { ArrowUpRight } from 'react-bootstrap-icons';
import Icono from '../ui/Icono.jsx';
import { nombreSector, tipoPorId } from '../../data/catalogos.js';
import { NIVELES, nivelPorNumero } from '../../data/semaforo.js';
import { haceCuanto, horaCorta } from '../../lib/tiempo.js';
import { ICONO_NIVEL, ICONO_TIPO } from '../iconos.js';
import EstadoBadge from '../ui/EstadoBadge.jsx';
import VotoBotones from './VotoBotones.jsx';
import { tituloAlerta } from './AlertaCard.jsx';
import css from './DetalleAlerta.module.css';

const esEnlaceSeguro = (url) => typeof url === 'string' && url.startsWith('https://');

export default function DetalleAlerta({ alerta, idTitulo, ahora }) {
  const tipo = ICONO_TIPO[alerta.tipo];
  const info = nivelPorNumero(alerta.nivel);

  return (
    <div className={css.detalle}>
      <div className={css.cabecera}>
        <span className={css.tipo}>
          <Icono {...tipo} />
          {tipoPorId(alerta.tipo).nombre}
        </span>
        {alerta.ejemplo && <span className="ejemplo">Ejemplo</span>}
      </div>

      <motion.h2 id={idTitulo} layoutId={`titulo-${alerta.id}`} className={css.titulo}>
        {tituloAlerta(alerta)}
      </motion.h2>

      <p className={css.descripcion}>{alerta.descripcion}</p>

      <dl className={css.datos}>
        <div>
          <dt>Sector</dt>
          <dd>{nombreSector(alerta.sector)}</dd>
        </div>
        <div>
          <dt>Reportado</dt>
          <dd>
            {horaCorta(alerta.creadoEn)} ({haceCuanto(alerta.creadoEn, ahora)})
          </dd>
        </div>
        <div>
          <dt>Confirmaciones</dt>
          <dd className={css.comunidad}>{alerta.confirmaciones}</dd>
        </div>
        <div>
          <dt>Votos de falso</dt>
          <dd>{alerta.falsos}</dd>
        </div>
      </dl>

      <section className={css.semaforo} aria-labelledby={`${idTitulo}-estado`}>
        <h3 id={`${idTitulo}-estado`} className={css.subtitulo}>
          Estado en el semáforo
        </h3>
        <EstadoBadge nivel={alerta.nivel} grande />
        <ol className={css.escalera} aria-label="Niveles del semáforo">
          {NIVELES.map((n) => {
            const nivelIcono = ICONO_NIVEL[n.id];
            const alcanzado = n.nivel <= alerta.nivel;
            return (
              <li key={n.id} data-nivel={n.nivel} data-alcanzado={alcanzado} aria-current={n.nivel === alerta.nivel ? 'step' : undefined}>
                <Icono {...nivelIcono} />
                <span>{n.corto}</span>
              </li>
            );
          })}
        </ol>
        <p className={css.siguiente}>{info.siguiente ?? info.efecto}</p>
      </section>

      {alerta.fuente && (
        <p className={css.fuente}>
          Fuente oficial:{' '}
          {esEnlaceSeguro(alerta.fuente.url) ? (
            <a className="enlace" href={alerta.fuente.url} target="_blank" rel="noopener noreferrer">
              Aviso de {alerta.fuente.nombre}
              <Icono de={ArrowUpRight} mov="empujar" entrada={false} />
              <span className="visualmente-oculto">(se abre en otra pestaña)</span>
            </a>
          ) : (
            <span>{alerta.fuente.nombre} (ejemplo, sin enlace)</span>
          )}
        </p>
      )}

      <VotoBotones alerta={alerta} />
    </div>
  );
}
