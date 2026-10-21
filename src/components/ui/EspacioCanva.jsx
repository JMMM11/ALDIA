import { Image } from 'react-bootstrap-icons';
import Icono from './Icono.jsx';
import css from './EspacioCanva.module.css';

// Espacio reservado para piezas que diseña el equipo en Canva (logo, infografía).
// Para reemplazarlo: exporta la pieza como WebP o SVG en src/assets y cambia este
// componente por un <img> con width y height.
export default function EspacioCanva({ pieza, responsable, proporcion = '16 / 9', className = '' }) {
  return (
    <div className={`${css.espacio} ${className}`} style={{ aspectRatio: proporcion }} role="img" aria-label={`Espacio reservado: ${pieza}`}>
      <Icono de={Image} className={css.icono} />
      <p className={css.pieza}>{pieza}</p>
      <p className={css.nota}>En diseño en Canva · {responsable}</p>
    </div>
  );
}
