import { useEffect, useState } from 'react';
import { SignOut } from '@phosphor-icons/react';
import { useDatos } from '../context/DatosContext.jsx';
import { nombreSector } from '../data/catalogos.js';
import { mensajeError } from '../services/alertas.js';
import * as mod from '../services/moderacion.js';
import CabeceraPagina from '../components/ui/CabeceraPagina.jsx';
import EstadoBadge from '../components/ui/EstadoBadge.jsx';
import { tituloAlerta } from '../components/alertas/AlertaCard.jsx';
import css from './Moderar.module.css';

const FUENTES = ['SINAPROC', 'IDAAN', 'Municipio'];

function Acceso({ onEntrar }) {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const entrar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      await mod.iniciarSesion(correo.trim(), clave);
      await onEntrar();
    } catch {
      // Mensaje genérico: no revela si el correo existe.
      setError('Correo o contraseña incorrectos.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form className={css.acceso} onSubmit={entrar}>
      <label className={css.campo}>
        <span>Correo</span>
        <input type="email" autoComplete="username" required value={correo} onChange={(e) => setCorreo(e.target.value)} />
      </label>
      <label className={css.campo}>
        <span>Contraseña</span>
        <input type="password" autoComplete="current-password" required value={clave} onChange={(e) => setClave(e.target.value)} />
      </label>
      {error && (
        <p className={css.error} role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-accion" disabled={enviando}>
        {enviando ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}

function FilaModeracion({ alerta, onHecho }) {
  const [fuente, setFuente] = useState(FUENTES[0]);
  const [url, setUrl] = useState('');
  const [nota, setNota] = useState('');
  const [mensaje, setMensaje] = useState('');
  const esTraslado = alerta.tipo === 'traslado';

  const hacer = async (accion, exito) => {
    try {
      await accion();
      setMensaje(exito);
      await onHecho();
    } catch (e) {
      setMensaje(mensajeError(e));
    }
  };

  return (
    <li className={css.fila}>
      <div className={css.cabecera}>
        <h3>{tituloAlerta(alerta)}</h3>
        {!esTraslado && <EstadoBadge nivel={alerta.nivel} />}
      </div>
      <p>{alerta.descripcion}</p>
      <p className={css.meta}>
        {alerta.confirmaciones} confirmaciones, {alerta.falsos} votos de falso
        {alerta.validada ? ', validada' : ''}
      </p>

      {esTraslado ? (
        <form
          className={css.accion}
          onSubmit={(e) => {
            e.preventDefault();
            hacer(() => mod.responderTraslado(alerta.id, nota), 'Respuesta enviada.');
          }}
        >
          <label className={css.campo}>
            <span>Respuesta para quien lo pidió (sin teléfonos)</span>
            <input value={nota} maxLength={280} required onChange={(e) => setNota(e.target.value)} />
          </label>
          <button type="submit" className="btn btn-fantasma btn-chico">
            Responder
          </button>
        </form>
      ) : (
        <div className={css.acciones}>
          <button
            type="button"
            className="btn btn-fantasma btn-chico"
            disabled={alerta.validada}
            onClick={() => hacer(() => mod.validar(alerta.id), 'Validada por moderador.')}
          >
            Validar
          </button>
          <form
            className={css.oficial}
            onSubmit={(e) => {
              e.preventDefault();
              hacer(() => mod.marcarOficial(alerta.id, fuente, url.trim()), 'Marcada como oficial.');
            }}
          >
            <label className={css.campo}>
              <span>Fuente</span>
              <select value={fuente} onChange={(e) => setFuente(e.target.value)}>
                {FUENTES.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </label>
            <label className={css.campo}>
              <span>Enlace al aviso (https)</span>
              <input type="url" pattern="https://.+" required value={url} onChange={(e) => setUrl(e.target.value)} />
            </label>
            <button type="submit" className="btn btn-fantasma btn-chico">
              Marcar oficial
            </button>
          </form>
        </div>
      )}
      <button type="button" className={`btn btn-chico ${css.cerrar}`} onClick={() => hacer(() => mod.cerrar(alerta.id), 'Cerrada.')}>
        Cerrar y archivar
      </button>
      <p className={css.estado} role="status">
        {mensaje}
      </p>
    </li>
  );
}

export default function Moderar() {
  const { modo, alertas, recargar } = useDatos();
  const [moderador, setModerador] = useState(undefined);

  const revisar = async () => {
    const actual = await mod.moderadorActual().catch(() => null);
    setModerador(actual);
    if (actual) await recargar();
  };

  useEffect(() => {
    if (modo === 'en-vivo') revisar();
  }, [modo]); // revisar solo al entrar a la página

  const salir = async () => {
    await mod.cerrarSesion();
    setModerador(null);
    await recargar();
  };

  const visibles = moderador
    ? alertas.filter((a) => moderador.sector === null || a.sector === moderador.sector)
    : [];

  return (
    <>
      <CabeceraPagina
        titulo="Moderación"
        intro="Acceso solo para moderadores designados por sector. Validar, marcar como oficial o cerrar queda registrado con tu cuenta."
      />
      <div className={`contenedor ${css.cuerpo}`}>
        {modo === 'demo' ? (
          <p className={css.aviso}>La moderación funciona cuando el sitio está conectado a la base de datos.</p>
        ) : moderador === undefined ? null : !moderador ? (
          <Acceso onEntrar={revisar} />
        ) : (
          <>
            <div className={css.barra}>
              <p>
                {moderador.correo}, {moderador.sector ? nombreSector(moderador.sector) : 'todos los sectores'}
              </p>
              <button type="button" className="btn btn-fantasma btn-chico" onClick={salir}>
                <SignOut aria-hidden="true" />
                Salir
              </button>
            </div>
            {visibles.length === 0 ? (
              <p className={css.aviso}>No hay alertas ni solicitudes activas en tu sector.</p>
            ) : (
              <ul className={css.lista}>
                {visibles.map((a) => (
                  <FilaModeracion key={a.id} alerta={a} onHecho={recargar} />
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  );
}
