import { ChatDots, Map as Mapa, PencilSquare, ShieldCheck } from 'react-bootstrap-icons';
import Icono from '../components/ui/Icono.jsx';
import { FOTOS } from '../data/fotos.js';
import { PASOS_TRASLADO, RUTAS_ALTERNAS } from '../data/secciones.js';
import { nombreSector } from '../data/catalogos.js';
import { useDatos } from '../context/DatosContext.jsx';
import { useReporte } from '../context/ReporteContext.jsx';
import { haceCuanto } from '../lib/tiempo.js';
import CabeceraPagina from '../components/ui/CabeceraPagina.jsx';
import { Escalonado, ItemEscalonado } from '../components/ui/Escalonado.jsx';
import css from './Traslados.module.css';

const ICONO_PASO = {
  pides: { de: PencilSquare, mov: 'sacudir' },
  revisa: { de: ShieldCheck, mov: 'latido' },
  conecta: { de: ChatDots, mov: 'latido' },
};

export default function Traslados() {
  const { abrirReporte } = useReporte();
  const { alertas } = useDatos();
  const misSolicitudes = alertas.filter((a) => a.tipo === 'traslado' && a.esMio);

  return (
    <>
      <CabeceraPagina
        titulo="Traslados al hospital"
        intro="¿Tienes que llegar al Hospital Nicolás A. Solano y no tienes cómo, o la vía está cerrada? Pide un traslado: un moderador de tu sector busca a un vecino que pueda llevarte y te responde aquí, sin publicar tu número."
        foto={FOTOS.barrio}
      >
        <button type="button" className="btn btn-accion" onClick={() => abrirReporte('traslado')}>
          Solicitar traslado
        </button>
      </CabeceraPagina>

      {misSolicitudes.length > 0 && (
        <section className="contenedor" aria-labelledby="mis-solicitudes">
          <h2 id="mis-solicitudes" className={css.subtitulo}>
            Tus solicitudes
          </h2>
          <ul className={css.solicitudes}>
            {misSolicitudes.map((s) => (
              <li key={s.id} className={css.solicitud}>
                <p className={css.meta}>
                  {nombreSector(s.sector)}, {haceCuanto(s.creadoEn)}
                  {s.ejemplo && <span className="ejemplo">Ejemplo</span>}
                </p>
                <p>{s.descripcion}</p>
                <p className={css.respuesta}>{s.nota ? `Moderador: ${s.nota}` : 'Esperando respuesta del moderador.'}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="seccion" aria-labelledby="como-traslado">
        <div className="contenedor">
          <h2 id="como-traslado" className="titulo-seccion">
            Cómo pedir un traslado
          </h2>
          <p className="intro">Nunca publicamos números de teléfono. Un moderador hace de puente entre quien necesita llegar y quien puede llevar.</p>
          <Escalonado as="ol" className={css.pasos}>
            {PASOS_TRASLADO.map((p) => {
              const icono = ICONO_PASO[p.id];
              return (
                <ItemEscalonado as="li" key={p.id} className={css.paso}>
                  <Icono {...icono} />
                  <h3>{p.titulo}</h3>
                  <p>{p.texto}</p>
                </ItemEscalonado>
              );
            })}
          </Escalonado>
        </div>
      </section>

      <section className={`seccion ${css.rutas}`} aria-labelledby="rutas">
        <div className="contenedor">
          <div className={css.cabeceraRutas}>
            <Icono de={Mapa} />
            <h2 id="rutas" className="titulo-seccion">
              Rutas alternas a la autopista Arraiján-La Chorrera
            </h2>
          </div>
          <ul className={css.listaRutas}>
            {RUTAS_ALTERNAS.map((r) => (
              <li key={r.id}>
                <h3>{r.nombre}</h3>
                <p>{r.texto}</p>
              </li>
            ))}
          </ul>
          <p className={css.nota}>Información de referencia. Antes de salir, revisa las alertas de vías cerradas de tu sector.</p>
        </div>
      </section>
    </>
  );
}
