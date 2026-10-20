import { Link, useRoute } from 'wouter';

// Enlace de navegación que sabe si apunta a la página actual: marca
// aria-current="page" y pasa "activo" a sus hijos para dibujar el indicador.
export default function EnlaceNav({ ruta, className, onClick, children }) {
  const [activo] = useRoute(ruta);
  return (
    <Link to={ruta} className={className} aria-current={activo ? 'page' : undefined} onClick={onClick}>
      {typeof children === 'function' ? children(activo) : children}
    </Link>
  );
}
