import { motion } from 'motion/react';
import '../../styles/iconos.css';

// Íconos SVG de Bootstrap Icons con un movimiento que dice algo de cada uno:
// el agua ondula, la gota cae, el reloj de arena se voltea. Se mueven una vez
// al aparecer en pantalla y otra vez al pasar el cursor por el enlace, botón o
// tarjeta que los contiene (eso último en styles/iconos.css).
const MOVIMIENTOS = {
  ola: { x: [0, -3, 3, -2, 0] },
  gota: { y: [-8, 0, -3, 0] },
  sacudir: { rotate: [0, -14, 12, -8, 4, 0] },
  latido: { scale: [1, 1.25, 0.92, 1.08, 1] },
  voltear: { rotate: [0, 180] },
  giro: { rotate: [0, 360] },
  aparecer: { scale: [0.6, 1.15, 1] },
  empujar: { x: [0, 4, 0] },
  atras: { x: [0, -4, 0] },
  girar90: { rotate: [0, 90] },
};

// entrada={false}: solo se mueve con el cursor (flechas, cerrar, controles).
export default function Icono({ de: Svg, mov = 'aparecer', entrada = true, className }) {
  const svg = <Svg className={className} aria-hidden="true" focusable="false" />;
  if (!entrada) {
    return (
      <span className="icono-mov" data-mov={mov}>
        {svg}
      </span>
    );
  }
  return (
    <motion.span
      className="icono-mov"
      data-mov={mov}
      whileInView={MOVIMIENTOS[mov]}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
    >
      {svg}
    </motion.span>
  );
}
