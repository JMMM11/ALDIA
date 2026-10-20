import { useRef } from 'react';
import { Link } from 'wouter';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { Plus } from '@phosphor-icons/react';
import { NAVEGACION } from '../../data/sitio.js';
import { useReporte } from '../../context/ReporteContext.jsx';
import { ICONO_NAV } from '../iconos.js';
import BotonTema from '../ui/BotonTema.jsx';
import EnlaceNav from './EnlaceNav.jsx';
import Logo from './Logo.jsx';
import css from './Header.module.css';

// Magnificación tipo dock: el ícono más cercano al puntero crece y sus vecinos
// un poco menos. Solo en escritorio (en el teléfono no hay puntero).
function ItemNav({ item, mouseX, magnificar }) {
  const ref = useRef(null);
  const distancia = useTransform(mouseX, (x) => {
    const caja = ref.current?.getBoundingClientRect();
    return caja ? x - (caja.left + caja.width / 2) : Infinity;
  });
  const escala = useSpring(useTransform(distancia, [-120, 0, 120], [1, 1.32, 1]), {
    stiffness: 420,
    damping: 28,
    mass: 0.4,
  });
  const Icono = ICONO_NAV[item.icono];

  return (
    <li ref={ref}>
      <EnlaceNav ruta={item.ruta} className={css.enlace}>
        {(isActive) => (
          <>
            {isActive && <motion.span layoutId="nav-activo" className={css.indicador} transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <motion.span className={css.icono} style={magnificar ? { scale: escala } : undefined}>
              <Icono weight={isActive ? 'fill' : 'regular'} aria-hidden="true" />
            </motion.span>
            <span className={css.nombre}>{item.nombre}</span>
          </>
        )}
      </EnlaceNav>
    </li>
  );
}

export default function Header({ sobreFoto }) {
  const { abrirReporte } = useReporte();
  const mouseX = useMotionValue(Infinity);
  const magnificar = !useReducedMotion();

  return (
    <header className={`${css.header} ${sobreFoto ? css.sobreFoto : css.solido}`}>
      <div className={`contenedor ${css.fila}`}>
        <Link to="/" className={css.marca} aria-label="ALDÍA, ir al inicio">
          <Logo />
        </Link>

        <nav
          aria-label="Principal"
          className={css.nav}
          onMouseMove={(e) => mouseX.set(e.clientX)}
          onMouseLeave={() => mouseX.set(Infinity)}
        >
          <ul className={css.lista}>
            {NAVEGACION.filter((n) => n.ruta !== '/').map((n) => (
              <ItemNav key={n.ruta} item={n} mouseX={mouseX} magnificar={magnificar} />
            ))}
          </ul>
        </nav>

        <div className={css.acciones}>
          <BotonTema className={css.botonIcono} />
          <button type="button" className={`btn btn-accion btn-chico ${css.reportar}`} onClick={() => abrirReporte()}>
            <Plus weight="bold" aria-hidden="true" />
            Reportar
          </button>
        </div>
      </div>
    </header>
  );
}
