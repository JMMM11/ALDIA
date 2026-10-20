import { useState } from 'react';
import { motion } from 'motion/react';
import { DotsThreeOutline, Plus } from '@phosphor-icons/react';
import { NAVEGACION } from '../../data/sitio.js';
import { useReporte } from '../../context/ReporteContext.jsx';
import { ICONO_NAV } from '../iconos.js';
import Modal from '../ui/Modal.jsx';
import EnlaceNav from './EnlaceNav.jsx';
import css from './NavMovil.module.css';

const PRINCIPALES = ['/', '/alertas'];
const DERECHA = ['/agua'];
const EN_MAS = NAVEGACION.filter((n) => ![...PRINCIPALES, ...DERECHA].includes(n.ruta));
const porRuta = (r) => NAVEGACION.find((n) => n.ruta === r);

function Item({ item }) {
  const Icono = ICONO_NAV[item.icono];
  return (
    <li>
      <EnlaceNav ruta={item.ruta} className={css.item}>
        {(isActive) => (
          <>
            {isActive && <motion.span layoutId="movil-activo" className={css.indicador} transition={{ type: 'spring', stiffness: 460, damping: 34 }} />}
            <Icono weight={isActive ? 'fill' : 'regular'} aria-hidden="true" />
            <span>{item.nombre}</span>
          </>
        )}
      </EnlaceNav>
    </li>
  );
}

// Barra inferior fija en el teléfono: lo más usado a un toque del pulgar.
export default function NavMovil() {
  const { abrirReporte } = useReporte();
  const [masAbierto, setMasAbierto] = useState(false);

  return (
    <>
      <nav aria-label="Principal" className={css.barra}>
        <ul className={css.lista}>
          {PRINCIPALES.map((r) => (
            <Item key={r} item={porRuta(r)} />
          ))}
          <li>
            <button type="button" className={css.reportar} onClick={() => abrirReporte()}>
              <span className={css.circulo}>
                <Plus weight="bold" aria-hidden="true" />
              </span>
              <span>Reportar</span>
            </button>
          </li>
          {DERECHA.map((r) => (
            <Item key={r} item={porRuta(r)} />
          ))}
          <li>
            <button type="button" className={css.item} onClick={() => setMasAbierto(true)} aria-haspopup="dialog">
              <DotsThreeOutline aria-hidden="true" />
              <span>Más</span>
            </button>
          </li>
        </ul>
      </nav>

      <Modal abierto={masAbierto} onCerrar={() => setMasAbierto(false)} titulo="Más secciones" variante="hoja">
        <h2 className={css.tituloMas}>Más secciones</h2>
        <ul className={css.listaMas}>
          {EN_MAS.map((n) => {
            const Icono = ICONO_NAV[n.icono];
            return (
              <li key={n.ruta}>
                <EnlaceNav ruta={n.ruta} className={css.enlaceMas} onClick={() => setMasAbierto(false)}>
                  <Icono weight="duotone" aria-hidden="true" />
                  {n.nombre}
                </EnlaceNav>
              </li>
            );
          })}
        </ul>
      </Modal>
    </>
  );
}
