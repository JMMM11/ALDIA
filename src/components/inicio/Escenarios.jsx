import { ESCENARIOS } from '../../data/inicio.js';
import { tipoPorId } from '../../data/catalogos.js';
import { ICONO_TIPO } from '../iconos.js';
import Carrusel from '../ui/Carrusel.jsx';
import css from './Escenarios.module.css';
import Icono from '../ui/Icono.jsx';

export default function Escenarios() {
  return (
    <section className={`seccion ${css.seccion}`} aria-labelledby="escenarios">
      <div className="contenedor">
        <h2 id="escenarios" className="titulo-seccion">
          Cómo se vive en el barrio
        </h2>
        <p className="intro">Escenarios ficticios para mostrar cómo ayuda FLUYA en situaciones reales del sector.</p>

        <Carrusel
          className={css.carrusel}
          etiqueta="Escenarios de ejemplo"
          items={ESCENARIOS}
          intervalo={8000}
          etiquetas={ESCENARIOS.map((e) => tipoPorId(e.tipo).nombre)}
          renderItem={(e) => {
            const tipo = ICONO_TIPO[e.tipo];
            return (
              <figure className={css.escenario}>
                <span className={css.icono}>
                  <Icono {...tipo} />
                </span>
                <blockquote className={css.cita}>
                  <p>“{e.texto}”</p>
                </blockquote>
                <figcaption className={css.pie}>
                  <span>{e.quien}</span>
                  <span className="ejemplo">Ejemplo</span>
                </figcaption>
              </figure>
            );
          }}
        />
      </div>
    </section>
  );
}
