import { Fingerprint, Prohibit, ThumbsDown, Timer } from '@phosphor-icons/react';
import { NIVELES, REGLAS } from '../data/semaforo.js';
import { SITIO } from '../data/sitio.js';
import { ICONO_NIVEL } from '../components/iconos.js';
import CabeceraPagina from '../components/ui/CabeceraPagina.jsx';
import Carrusel from '../components/ui/Carrusel.jsx';
import EspacioCanva from '../components/ui/EspacioCanva.jsx';
import { Escalonado, ItemEscalonado } from '../components/ui/Escalonado.jsx';
import css from './ComoFunciona.module.css';

const ICONO_REGLA = { 'un-voto': Fingerprint, propio: Prohibit, falso: ThumbsDown, caduca: Timer };

export default function ComoFunciona() {
  return (
    <>
      <CabeceraPagina
        titulo="¿Cómo funciona?"
        intro="Cada alerta pasa por un semáforo de cuatro niveles. Sube cuando más vecinos la confirman y baja cuando la desmienten."
      />

      <section className={`contenedor ${css.semaforo}`} aria-labelledby="niveles">
        <h2 id="niveles" className="visualmente-oculto">
          Los cuatro niveles del semáforo
        </h2>
        <Carrusel
          etiqueta="Niveles del semáforo"
          items={NIVELES}
          etiquetas={NIVELES.map((n) => n.nombre)}
          renderItem={(n) => {
            const Icono = ICONO_NIVEL[n.id];
            return (
              <article className={css.nivel} data-nivel={n.nivel}>
                <div className={css.visual}>
                  <span className={css.numero} aria-hidden="true">
                    {n.nivel}
                  </span>
                  <Icono weight="duotone" aria-hidden="true" className={css.icono} />
                </div>
                <div className={css.textoNivel}>
                  <p className={css.etiqueta}>Nivel {n.nivel} de 4</p>
                  <h3 className={css.nombre}>{n.nombre}</h3>
                  <dl className={css.datos}>
                    <div>
                      <dt>Cuándo</dt>
                      <dd>{n.regla}</dd>
                    </div>
                    <div>
                      <dt>Qué pasa</dt>
                      <dd>{n.efecto}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            );
          }}
        />
      </section>

      <section className="seccion" aria-labelledby="reglas">
        <div className="contenedor">
          <h2 id="reglas" className="titulo-seccion">
            Reglas que protegen la información
          </h2>
          <p className="intro">Se cumplen en la base de datos, no en tu teléfono: nadie puede saltárselas modificando la página.</p>
          <Escalonado as="ul" className={css.reglas}>
            {REGLAS.map((r) => {
              const Icono = ICONO_REGLA[r.id];
              return (
                <ItemEscalonado as="li" key={r.id} className={css.regla}>
                  <Icono weight="duotone" aria-hidden="true" />
                  <h3>{r.titulo}</h3>
                  <p>{r.texto}</p>
                </ItemEscalonado>
              );
            })}
          </Escalonado>
        </div>
      </section>

      <section className={`seccion ${css.idea}`} aria-labelledby="idea">
        <div className={`contenedor ${css.ideaRejilla}`}>
          <div>
            <h2 id="idea" className="titulo-seccion">
              La idea detrás del semáforo
            </h2>
            <p className={css.frase}>{SITIO.ideaClave}</p>
            <p className={css.aviso}>{SITIO.aviso}</p>
          </div>
          <EspacioCanva pieza="Infografía del semáforo" responsable="Josh Amaya" proporcion="4 / 5" />
        </div>
      </section>
    </>
  );
}
