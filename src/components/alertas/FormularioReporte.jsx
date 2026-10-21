import { useId, useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'motion/react';
import { CheckCircleFill, LockFill } from 'react-bootstrap-icons';
import Icono from '../ui/Icono.jsx';
import { LIMITE_DESCRIPCION, SECTORES, TIPOS } from '../../data/catalogos.js';
import { validarReporte } from '../../lib/validacion.js';
import { useDatos } from '../../context/DatosContext.jsx';
import { ICONO_TIPO } from '../iconos.js';
import css from './FormularioReporte.module.css';

const ORDEN_CAMPOS = ['sector', 'tipo', 'descripcion'];

// Titulo: h2 dentro del modal, h1 cuando el formulario es la página /reportar.
export default function FormularioReporte({ tipoInicial = '', idTitulo, onListo, Titulo = 'h2' }) {
  const { reportar, modo } = useDatos();
  const base = useId();
  const [datos, setDatos] = useState({ sector: '', tipo: tipoInicial, descripcion: '' });
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(null);

  const id = (campo) => `${base}-${campo}`;
  const cambiar = (campo) => (e) => {
    setDatos((d) => ({ ...d, [campo]: e.target.value }));
    if (errores[campo]) setErrores((er) => ({ ...er, [campo]: undefined }));
  };

  const enviar = async (e) => {
    e.preventDefault();
    const encontrados = validarReporte(datos);
    setErrores(encontrados);
    const primero = ORDEN_CAMPOS.find((c) => encontrados[c]);
    if (primero) {
      document.getElementById(id(primero))?.focus();
      return;
    }
    setEnviando(true);
    setErrorServidor(null);
    const error = await reportar(datos);
    setEnviando(false);
    if (error) setErrorServidor(error);
    else setEnviado(datos.tipo);
  };

  if (enviado) {
    const traslado = enviado === 'traslado';
    return (
      <div className={css.exito} role="status">
        <motion.span
          className={css.check}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 420, damping: 18 }}
        >
          <Icono de={CheckCircleFill} mov="latido" />
        </motion.span>
        <Titulo id={idTitulo} className={css.titulo} tabIndex={-1}>
          {traslado ? 'Solicitud enviada' : 'Reporte enviado'}
        </Titulo>
        <p className={css.texto}>
          {traslado
            ? 'Solo la ve el moderador de tu sector. Su respuesta aparecerá en Traslados y rutas.'
            : 'Quedó como "Reportado". Pasa a "En confirmación" cuando dos vecinos lo confirmen en menos de 30 minutos.'}
        </p>
        <div className={css.acciones}>
          <Link className="btn btn-accion" to={traslado ? '/traslados' : '/alertas'} onClick={onListo}>
            {traslado ? 'Ver mi solicitud' : 'Ver alertas'}
          </Link>
          <button
            type="button"
            className="btn btn-fantasma"
            onClick={() => {
              setDatos({ sector: '', tipo: '', descripcion: '' });
              setEnviado(null);
            }}
          >
            Hacer otro reporte
          </button>
        </div>
      </div>
    );
  }

  const largo = datos.descripcion.trim().length;
  const esTraslado = datos.tipo === 'traslado';

  return (
    <form className={css.formulario} onSubmit={enviar} noValidate>
      <div className={css.encabezado}>
        <Titulo id={idTitulo} className={css.titulo}>
          {esTraslado ? 'Solicitar traslado' : 'Reportar lo que ves'}
        </Titulo>
        <p className={css.texto}>
          {esTraslado
            ? 'Tu solicitud no se publica. La recibe el moderador de tu sector.'
            : 'Tu reporte empieza como "Reportado" y se difunde cuando otros vecinos lo confirman.'}
        </p>
      </div>

      <fieldset className={css.campo} aria-describedby={errores.sector ? id('sector-error') : undefined}>
        <legend className={css.etiqueta}>¿En qué sector?</legend>
        <div className={css.opcionesSector}>
          {SECTORES.map((s, i) => (
            <label key={s.id} className={css.opcion}>
              <input
                id={i === 0 ? id('sector') : undefined}
                type="radio"
                name={id('sector-radio')}
                value={s.id}
                checked={datos.sector === s.id}
                onChange={cambiar('sector')}
              />
              <span>{s.nombre}</span>
            </label>
          ))}
        </div>
        {errores.sector && (
          <p id={id('sector-error')} className={css.error}>
            {errores.sector}
          </p>
        )}
      </fieldset>

      <fieldset className={css.campo} aria-describedby={errores.tipo ? id('tipo-error') : undefined}>
        <legend className={css.etiqueta}>¿Qué está pasando?</legend>
        <div className={css.opcionesTipo}>
          {TIPOS.map((t, i) => {
            const tipo = ICONO_TIPO[t.id];
            return (
              <label key={t.id} className={css.tipo}>
                <input
                  id={i === 0 ? id('tipo') : undefined}
                  type="radio"
                  name={id('tipo-radio')}
                  value={t.id}
                  checked={datos.tipo === t.id}
                  onChange={cambiar('tipo')}
                />
                <Icono {...tipo} className={css.iconoTipo} />
                <span className={css.nombreTipo}>{t.nombre}</span>
                <span className={css.ayudaTipo}>{t.ayuda}</span>
              </label>
            );
          })}
        </div>
        {errores.tipo && (
          <p id={id('tipo-error')} className={css.error}>
            {errores.tipo}
          </p>
        )}
      </fieldset>

      <div className={css.campo}>
        <label htmlFor={id('descripcion')} className={css.etiqueta}>
          {esTraslado ? '¿Qué necesitas?' : 'Describe lo que ves'}
        </label>
        <p id={id('descripcion-ayuda')} className={css.ayuda}>
          Sin nombres ni teléfonos. Entre {LIMITE_DESCRIPCION.min} y {LIMITE_DESCRIPCION.max} caracteres.
        </p>
        <textarea
          id={id('descripcion')}
          className={css.textarea}
          rows={4}
          maxLength={LIMITE_DESCRIPCION.max}
          value={datos.descripcion}
          onChange={cambiar('descripcion')}
          aria-invalid={Boolean(errores.descripcion)}
          aria-describedby={`${id('descripcion-ayuda')} ${id('descripcion-contador')}${errores.descripcion ? ` ${id('descripcion-error')}` : ''}`}
          placeholder={esTraslado ? 'Ej.: cita a las 2:00 p. m., la autopista está trancada' : 'Ej.: el río ya llegó a la cancha'}
        />
        <p id={id('descripcion-contador')} className={css.contador}>
          {largo} de {LIMITE_DESCRIPCION.max}
        </p>
        {errores.descripcion && (
          <p id={id('descripcion-error')} className={css.error}>
            {errores.descripcion}
          </p>
        )}
      </div>

      <p className={css.privacidad}>
        <Icono de={LockFill} mov="sacudir" />
        Participas con una identidad anónima. No guardamos tu nombre ni tu teléfono.
      </p>

      {modo === 'demo' && (
        <p className={css.demo}>Modo demostración: el reporte se guarda solo en este navegador y desaparece al recargar.</p>
      )}

      {errorServidor && (
        <p className={css.error} role="alert">
          {errorServidor}
        </p>
      )}

      <button type="submit" className={`btn btn-accion ${css.enviar}`} disabled={enviando}>
        {enviando ? 'Enviando…' : esTraslado ? 'Enviar solicitud' : 'Enviar reporte'}
      </button>
    </form>
  );
}
