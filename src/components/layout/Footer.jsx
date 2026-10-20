import { Link } from 'wouter';
import { FOTOS } from '../../data/fotos.js';
import { NAVEGACION, SITIO } from '../../data/sitio.js';
import Logo from './Logo.jsx';
import css from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={`contenedor ${css.rejilla}`}>
        <div className={css.marca}>
          <Logo />
          <p className={css.eslogan}>{SITIO.eslogan}.</p>
          <p className={css.aviso}>
            {SITIO.aviso} <strong>{SITIO.emergencia}</strong>
          </p>
        </div>

        <nav aria-label="Secciones del sitio">
          <h2 className={css.titulo}>Secciones</h2>
          <ul className={css.enlaces}>
            {NAVEGACION.map((n) => (
              <li key={n.ruta}>
                <Link to={n.ruta}>{n.nombre}</Link>
              </li>
            ))}
            <li>
              <Link to="/moderar">Acceso para moderadores</Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className={css.titulo}>Fotos</h2>
          <ul className={css.creditos}>
            {Object.values(FOTOS).map((f) => (
              <li key={f.enlace}>
                <a href={f.enlace} target="_blank" rel="noopener noreferrer">
                  {f.autor}
                </a>{' '}
                en Unsplash
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`contenedor ${css.base}`}>
        <p>{SITIO.proyecto}</p>
        <p>Los ejemplos marcados como "Ejemplo" son ficticios y sirven para mostrar cómo funciona la plataforma.</p>
      </div>
    </footer>
  );
}
