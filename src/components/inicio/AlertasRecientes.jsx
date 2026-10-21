import { Link } from 'wouter';
import { ArrowRight } from 'react-bootstrap-icons';
import Icono from '../ui/Icono.jsx';
import { useDatos } from '../../context/DatosContext.jsx';
import { nombreSector, tipoPorId } from '../../data/catalogos.js';
import { haceCuanto } from '../../lib/tiempo.js';
import { useAhora } from '../../hooks/useAhora.js';
import { ICONO_TIPO } from '../iconos.js';
import EstadoBadge from '../ui/EstadoBadge.jsx';
import { Escalonado, ItemEscalonado } from '../ui/Escalonado.jsx';
import css from './AlertasRecientes.module.css';

export default function AlertasRecientes() {
  const { alertas, conEjemplos } = useDatos();
  const ahora = useAhora();
  // Solo lo que ya se difunde (nivel 2 o más); los traslados nunca son públicos.
  const recientes = alertas.filter((a) => a.nivel >= 2 && a.tipo !== 'traslado').slice(0, 3);

  return (
    <section className={`seccion ${css.seccion}`} aria-labelledby="recientes">
      <div className="contenedor">
        <div className={css.cabecera}>
          <h2 id="recientes" className="titulo-seccion">
            Lo último en tu sector
          </h2>
          <Link to="/alertas" className="enlace">
            Ver todas las alertas
            <Icono de={ArrowRight} mov="empujar" entrada={false} />
          </Link>
        </div>

        {recientes.length === 0 ? (
          <p className={css.vacio}>Todo tranquilo por ahora. Si ves algo, repórtalo y deja que tus vecinos lo confirmen.</p>
        ) : (
          <Escalonado as="ol" className={css.lista}>
            {recientes.map((a) => {
              const tipo = ICONO_TIPO[a.tipo];
              return (
                <ItemEscalonado as="li" key={a.id} className={css.fila}>
                  <Icono {...tipo} className={css.icono} />
                  <div className={css.cuerpo}>
                    <p className={css.titulo}>
                      {tipoPorId(a.tipo).nombre} en {nombreSector(a.sector)}
                    </p>
                    <p className={css.meta}>
                      <time dateTime={a.creadoEn}>{haceCuanto(a.creadoEn, ahora)}</time>
                      {a.ejemplo && <span className="ejemplo">Ejemplo</span>}
                    </p>
                  </div>
                  <EstadoBadge nivel={a.nivel} />
                </ItemEscalonado>
              );
            })}
          </Escalonado>
        )}
        {conEjemplos && <p className={css.nota}>Vista previa: las alertas marcadas "Ejemplo" son ficticias.</p>}
      </div>
    </section>
  );
}
