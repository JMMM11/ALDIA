import { Link } from 'wouter';
import CabeceraPagina from '../components/ui/CabeceraPagina.jsx';

export default function NoEncontrada() {
  return (
    <CabeceraPagina titulo="Esta página no existe" intro="Puede que el enlace esté mal escrito o que la página se haya movido.">
      <Link to="/" className="btn btn-accion">
        Volver al inicio
      </Link>
    </CabeceraPagina>
  );
}
