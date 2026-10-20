import { ALIADOS, EQUIPO } from '../data/secciones.js';
import { SITIO } from '../data/sitio.js';
import CabeceraPagina from '../components/ui/CabeceraPagina.jsx';
import EspacioCanva from '../components/ui/EspacioCanva.jsx';
import { Escalonado, ItemEscalonado } from '../components/ui/Escalonado.jsx';
import css from './Nosotros.module.css';

export default function Nosotros() {
  return (
    <>
      <CabeceraPagina
        titulo="Nosotros"
        intro="Somos estudiantes de la Universidad Tecnológica de Panamá. ALDÍA nació para mostrar cómo el trabajo en equipo y la tecnología pueden proteger a un barrio."
      />

      <section className="contenedor" aria-labelledby="equipo">
        <div className={css.rejillaEquipo}>
          <div>
            <h2 id="equipo" className="titulo-seccion">
              El equipo
            </h2>
            <Escalonado as="ul" className={css.equipo}>
              {EQUIPO.map((p) => (
                <ItemEscalonado as="li" key={p.id} className={css.persona}>
                  <span className={css.iniciales} aria-hidden="true">
                    {p.iniciales}
                  </span>
                  <div>
                    <h3>{p.nombre}</h3>
                    <p>{p.rol}</p>
                  </div>
                </ItemEscalonado>
              ))}
            </Escalonado>
          </div>
          <EspacioCanva pieza="Logo de ALDÍA" responsable="Josh Amaya" proporcion="1 / 1" className={css.logo} />
        </div>
      </section>

      <section className={`seccion ${css.aliados}`} aria-labelledby="aliados">
        <div className="contenedor">
          <h2 id="aliados" className="titulo-seccion">
            Relación con las instituciones
          </h2>
          <p className="intro">
            Es una propuesta: ALDÍA no tiene convenio con estas entidades ni habla en su nombre. Planteamos cómo podría complementarlas.
          </p>
          <ul className={css.listaAliados}>
            {ALIADOS.map((a) => (
              <li key={a.id}>
                <h3>{a.nombre}</h3>
                <p>{a.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="seccion" aria-labelledby="proyecto">
        <div className="contenedor">
          <h2 id="proyecto" className="titulo-seccion">
            El proyecto
          </h2>
          <p className="intro">{SITIO.proyecto}</p>
          <p className="intro">{SITIO.ideaClave}</p>
        </div>
      </section>
    </>
  );
}
