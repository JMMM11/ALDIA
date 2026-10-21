import { CheckSquare, LockFill, Whatsapp } from 'react-bootstrap-icons';
import Icono from '../components/ui/Icono.jsx';
import { FOTOS } from '../data/fotos.js';
import { DATOS_PERSONALES, VERIFICAR } from '../data/secciones.js';
import { SECTORES } from '../data/catalogos.js';
import CabeceraPagina from '../components/ui/CabeceraPagina.jsx';
import { Escalonado, ItemEscalonado } from '../components/ui/Escalonado.jsx';
import css from './Aprende.module.css';

export default function Aprende() {
  return (
    <>
      <CabeceraPagina
        titulo="Ciudadanía digital"
        intro="Un mensaje falso en el grupo puede asustar a todo el barrio. Estas costumbres hacen que la información que circula sea confiable."
        foto={FOTOS.telefono}
      />

      <section className="seccion" aria-labelledby="verificar">
        <div className="contenedor">
          <h2 id="verificar" className="titulo-seccion">
            Antes de reenviar, pregúntate
          </h2>
          <Escalonado as="ol" className={css.preguntas}>
            {VERIFICAR.map((v) => (
              <ItemEscalonado as="li" key={v.id} className={css.pregunta}>
                <Icono de={CheckSquare} mov="latido" />
                <h3>{v.pregunta}</h3>
                <p>{v.texto}</p>
              </ItemEscalonado>
            ))}
          </Escalonado>
        </div>
      </section>

      <section className={`seccion ${css.datos}`} aria-labelledby="datos">
        <div className={`contenedor ${css.datosRejilla}`}>
          <div className={css.datosTitulo}>
            <Icono de={LockFill} mov="sacudir" />
            <h2 id="datos" className="titulo-seccion">
              Cuida tus datos personales
            </h2>
          </div>
          <ul className={css.listaDatos}>
            {DATOS_PERSONALES.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="seccion" aria-labelledby="whatsapp">
        <div className="contenedor">
          <h2 id="whatsapp" className="titulo-seccion">
            Únete al grupo de WhatsApp de tu sector
          </h2>
          <p className="intro">
            Las alertas confirmadas se comparten en el grupo de cada sector. El enlace lo publica el moderador cuando el grupo esté listo.
          </p>
          <ul className={css.grupos}>
            {SECTORES.map((s) => (
              <li key={s.id} className={css.grupo}>
                <Icono de={Whatsapp} mov="sacudir" />
                <span className={css.nombreGrupo}>{s.nombre}</span>
                <span className={css.pendiente}>Enlace pendiente</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
