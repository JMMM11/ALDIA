import { Drop, MapPin } from '@phosphor-icons/react';
import { FOTOS } from '../data/fotos.js';
import { CONSEJOS_AGUA, PUNTOS_AGUA } from '../data/secciones.js';
import { nombreSector } from '../data/catalogos.js';
import { useDatos } from '../context/DatosContext.jsx';
import { useAhora } from '../hooks/useAhora.js';
import { haceCuanto } from '../lib/tiempo.js';
import CabeceraPagina from '../components/ui/CabeceraPagina.jsx';
import EstadoBadge from '../components/ui/EstadoBadge.jsx';
import { Escalonado, ItemEscalonado } from '../components/ui/Escalonado.jsx';
import css from './Agua.module.css';

export default function Agua() {
  const { alertas } = useDatos();
  const ahora = useAhora();
  const cortes = alertas.filter((a) => a.tipo === 'corte-agua' && a.nivel >= 2);

  return (
    <>
      <CabeceraPagina
        titulo="Agua potable"
        intro="El agua del sector llega desde la potabilizadora Jaime Díaz Quintero, conocida como El Trapichito. El aviso oficial de cortes lo da el IDAAN; aquí ves en qué calles ya se nota."
        foto={FOTOS.agua}
      />

      <section className="contenedor" aria-labelledby="cortes">
        <h2 id="cortes" className={css.subtitulo}>
          Cortes confirmados ahora
        </h2>
        {cortes.length === 0 ? (
          <p className={css.vacio}>No hay cortes de agua confirmados en este momento.</p>
        ) : (
          <ul className={css.cortes}>
            {cortes.map((c) => (
              <li key={c.id} className={css.corte}>
                <div className={css.corteCabecera}>
                  <h3>{nombreSector(c.sector)}</h3>
                  <EstadoBadge nivel={c.nivel} />
                </div>
                <p>{c.descripcion}</p>
                <p className={css.meta}>
                  <time dateTime={c.creadoEn}>{haceCuanto(c.creadoEn, ahora)}</time>
                  {c.ejemplo && <span className="ejemplo">Ejemplo</span>}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="seccion" aria-labelledby="puntos">
        <div className={`contenedor ${css.puntosRejilla}`}>
          <div>
            <h2 id="puntos" className="titulo-seccion">
              Puntos de distribución
            </h2>
            <p className="intro">Cuando hay carros cisterna, los moderadores publican dónde y a qué hora pasan.</p>
          </div>
          <Escalonado as="ul" className={css.puntos}>
            {PUNTOS_AGUA.map((p) => (
              <ItemEscalonado as="li" key={p.id} className={css.punto}>
                <MapPin weight="duotone" aria-hidden="true" />
                <div>
                  <h3>{p.lugar}</h3>
                  <p>
                    {nombreSector(p.sector)}, {p.horario}
                  </p>
                </div>
                <span className="ejemplo">Ejemplo</span>
              </ItemEscalonado>
            ))}
          </Escalonado>
        </div>
      </section>

      <section className={`seccion ${css.consejos}`} aria-labelledby="consejos">
        <div className="contenedor">
          <h2 id="consejos" className="titulo-seccion">
            Mientras vuelve el agua
          </h2>
          <ul className={css.listaConsejos}>
            {CONSEJOS_AGUA.map((c) => (
              <li key={c}>
                <Drop weight="fill" aria-hidden="true" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
