import { useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, PlusLg } from 'react-bootstrap-icons';
import { NAVEGACION } from '../../data/sitio.js';
import { useReporte } from '../../context/ReporteContext.jsx';
import { ICONO_NAV } from '../iconos.js';
import Icono from '../ui/Icono.jsx';
import EnlaceNav from './EnlaceNav.jsx';
import Logo from './Logo.jsx';
import css from './Header.module.css';

const [INICIO, ...RESTO] = NAVEGACION.filter((n) => !n.grupo);
const REPORTES = NAVEGACION.filter((n) => n.grupo === 'reportes');

function Indicador() {
  return <motion.span layoutId="nav-activo" className={css.indicador} transition={{ type: 'spring', stiffness: 420, damping: 34 }} />;
}

function Enlace({ item }) {
  return (
    <li>
      <EnlaceNav ruta={item.ruta} className={css.enlace}>
        {(activo) => (
          <>
            {activo && <Indicador />}
            {item.nombre}
          </>
        )}
      </EnlaceNav>
    </li>
  );
}

// Menú desplegable "Reportes": se abre al pasar el cursor o con clic/teclado,
// y se cierra con Escape, al salir, al hacer clic fuera o al navegar.
function MenuReportes() {
  const [abierto, setAbierto] = useState(false);
  const [ubicacion] = useLocation();
  const raiz = useRef(null);
  const boton = useRef(null);
  const conCursor = useRef(false);
  const id = useId();
  const activo = REPORTES.some((n) => n.ruta === ubicacion);

  useEffect(() => setAbierto(false), [ubicacion]);

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e) => raiz.current?.contains(e.target) || setAbierto(false);
    const tecla = (e) => {
      if (e.key !== 'Escape') return;
      setAbierto(false);
      boton.current?.focus();
    };
    document.addEventListener('pointerdown', fuera);
    document.addEventListener('keydown', tecla);
    return () => {
      document.removeEventListener('pointerdown', fuera);
      document.removeEventListener('keydown', tecla);
    };
  }, [abierto]);

  return (
    <li
      ref={raiz}
      className={css.grupo}
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return;
        conCursor.current = true;
        setAbierto(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== 'mouse') return;
        conCursor.current = false;
        setAbierto(false);
      }}
      onBlur={(e) => raiz.current.contains(e.relatedTarget) || setAbierto(false)}
    >
      <button
        ref={boton}
        type="button"
        className={css.enlace}
        aria-expanded={abierto}
        aria-controls={id}
        // Si el cursor ya lo abrió, el clic no lo cierra; con teclado o al tocar, alterna.
        onClick={() => setAbierto((v) => conCursor.current || !v)}
      >
        {activo && <Indicador />}
        Reportes
        <ChevronDown className={css.flechita} data-abierto={abierto} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {abierto && (
          <motion.div
            id={id}
            className={css.panel}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className={css.caja}>
              {REPORTES.map((n, i) => {
                const icono = ICONO_NAV[n.icono];
                return (
                  <motion.li
                    key={n.ruta}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.2 }}
                  >
                    <EnlaceNav ruta={n.ruta} className={css.opcion}>
                      <span className={css.opcionIcono}>
                        <Icono de={icono.de} mov={icono.mov} entrada={false} />
                      </span>
                      <span>
                        <span className={css.opcionNombre}>{n.nombre}</span>
                        <span className={css.opcionTexto}>{n.texto}</span>
                      </span>
                    </EnlaceNav>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

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
            <Enlace item={INICIO} />
            <MenuReportes />
            {RESTO.map((n) => (
              <Enlace key={n.ruta} item={n} />
            ))}
          </ul>
        </nav>

        <button type="button" className={`btn btn-accion btn-chico ${css.reportar}`} onClick={() => abrirReporte()}>
          <Icono de={PlusLg} mov="girar90" entrada={false} />
          Reportar
        </button>
      </div>
    </header>
  );
}
