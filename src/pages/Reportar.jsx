import { useId } from 'react';
import { useSearchParams } from 'wouter';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';
import Icono from '../components/ui/Icono.jsx';
import { SITIO } from '../data/sitio.js';
import { TIPOS } from '../data/catalogos.js';
import FormularioReporte from '../components/alertas/FormularioReporte.jsx';
import css from './Reportar.module.css';

export default function Reportar() {
  const idTitulo = useId();
  const [params] = useSearchParams();
  const tipo = TIPOS.some((t) => t.id === params.get('tipo')) ? params.get('tipo') : '';

  return (
    <div className={`contenedor ${css.pagina}`}>
      <div className={css.formulario}>
        <FormularioReporte tipoInicial={tipo} idTitulo={idTitulo} Titulo="h1" />
      </div>
      <aside className={css.lateral} aria-label="Antes de reportar">
        <div className={css.emergencia}>
          <Icono de={ExclamationTriangleFill} mov="sacudir" />
          <p>
            <strong>{SITIO.emergencia}</strong> ALDÍA sirve para avisar a tus vecinos, no reemplaza a SINAPROC ni a los bomberos.
          </p>
        </div>
        <h2 className={css.titulo}>Un buen reporte</h2>
        <ul className={css.lista}>
          <li>Dice qué ves y dónde, con una referencia que todos conozcan.</li>
          <li>Cuenta solo lo que estás viendo tú, no lo que te contaron.</li>
          <li>No incluye nombres, teléfonos ni fotos de personas.</li>
        </ul>
      </aside>
    </div>
  );
}
