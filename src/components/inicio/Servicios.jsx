import { Link } from 'wouter';
import { ArrowRight } from 'react-bootstrap-icons';
import Icono from '../ui/Icono.jsx';
import { FOTOS } from '../../data/fotos.js';
import Foto from '../ui/Foto.jsx';
import { Escalonado, ItemEscalonado } from '../ui/Escalonado.jsx';
import css from './Servicios.module.css';

const SERVICIOS = [
  {
    ruta: '/traslados',
    titulo: 'Traslados y rutas',
    texto: 'Rutas alternas a la autopista y ayuda para llegar al Hospital Nicolás A. Solano, sin publicar teléfonos.',
    foto: FOTOS.barrio,
    destacado: true,
  },
  {
    ruta: '/agua',
    titulo: 'Agua potable',
    texto: 'Cortes, horarios y puntos de distribución por sector.',
    foto: FOTOS.via,
  },
  {
    ruta: '/aprende',
    titulo: 'Aprende a verificar',
    texto: 'Qué revisar antes de reenviar un audio o una foto.',
    foto: FOTOS.telefono,
  },
];

export default function Servicios() {
  return (
    <section className="seccion" aria-labelledby="servicios">
      <div className="contenedor">
        <h2 id="servicios" className="titulo-seccion">
          Más que alertas
        </h2>
        <Escalonado className={css.bento}>
          {SERVICIOS.map((s) => (
            <ItemEscalonado key={s.ruta} className={`${css.celda} ${s.destacado ? css.destacada : ''}`}>
              <Foto foto={s.foto} className={css.foto} sizes={s.destacado ? '(max-width: 900px) 100vw, 60vw' : '(max-width: 900px) 100vw, 40vw'} />
              <div className={css.texto}>
                <h3 className={css.titulo}>
                  <Link to={s.ruta} className={css.enlace}>
                    {s.titulo}
                  </Link>
                </h3>
                <p>{s.texto}</p>
                <Icono de={ArrowRight} mov="empujar" entrada={false} className={css.flecha} />
              </div>
            </ItemEscalonado>
          ))}
        </Escalonado>
      </div>
    </section>
  );
}
