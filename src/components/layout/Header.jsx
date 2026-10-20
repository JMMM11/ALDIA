import { Link } from 'wouter';
import { motion } from 'motion/react';
import { Plus } from '@phosphor-icons/react';
import { NAVEGACION } from '../../data/sitio.js';
import { useReporte } from '../../context/ReporteContext.jsx';
import EnlaceNav from './EnlaceNav.jsx';
import Logo from './Logo.jsx';
import css from './Header.module.css';

// Encabezado no fijo: se queda arriba y se va con el scroll.
export default function Header({ sobreFoto }) {
  const { abrirReporte } = useReporte();

  return (
    <header className={`${css.header} ${sobreFoto ? css.sobreFoto : ''}`}>
      <div className={`contenedor ${css.fila}`}>
        <Link to="/" className={css.marca} aria-label="ALDÍA, ir al inicio">
          <Logo />
        </Link>

        <nav aria-label="Principal" className={css.nav}>
          <ul className={css.lista}>
            {NAVEGACION.filter((n) => n.ruta !== '/').map((n) => (
              <li key={n.ruta}>
                <EnlaceNav ruta={n.ruta} className={css.enlace}>
                  {(activo) => (
                    <>
                      {activo && (
                        <motion.span
                          layoutId="nav-activo"
                          className={css.indicador}
                          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        />
                      )}
                      {n.nombre}
                    </>
                  )}
                </EnlaceNav>
              </li>
            ))}
          </ul>
        </nav>

        <button type="button" className={`btn btn-accion btn-chico ${css.reportar}`} onClick={() => abrirReporte()}>
          <Plus weight="bold" aria-hidden="true" />
          Reportar
        </button>
      </div>
    </header>
  );
}
