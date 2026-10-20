import { useId, useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { Plus } from '@phosphor-icons/react';
import { useDatos } from '../context/DatosContext.jsx';
import { useReporte } from '../context/ReporteContext.jsx';
import { useAhora } from '../hooks/useAhora.js';
import AlertaCard from '../components/alertas/AlertaCard.jsx';
import DetalleAlerta from '../components/alertas/DetalleAlerta.jsx';
import FiltrosAlertas from '../components/alertas/FiltrosAlertas.jsx';
import CabeceraPagina from '../components/ui/CabeceraPagina.jsx';
import Modal from '../components/ui/Modal.jsx';
import css from './Alertas.module.css';

const animTarjeta = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.97 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
};

function Rejilla({ alertas, onAbrir, ahora }) {
  return (
    <ul className={css.rejilla}>
      <AnimatePresence mode="popLayout" initial={false}>
        {alertas.map((a, i) => (
          <motion.li key={a.id} layout {...animTarjeta} transition={{ ...animTarjeta.transition, delay: Math.min(i, 6) * 0.03 }}>
            <AlertaCard alerta={a} onAbrir={onAbrir} ahora={ahora} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

export default function Alertas() {
  const { alertas, cargando, error, modo } = useDatos();
  const { abrirReporte } = useReporte();
  const ahora = useAhora();
  const idTitulo = useId();
  const [sector, setSector] = useState('todos');
  const [tipo, setTipo] = useState('todos');
  const [abiertaId, setAbiertaId] = useState(null);

  const filtradas = useMemo(
    () =>
      alertas.filter(
        (a) =>
          a.tipo !== 'traslado' &&
          (sector === 'todos' || a.sector === sector) &&
          (tipo === 'todos' || a.tipo === tipo),
      ),
    [alertas, sector, tipo],
  );
  const activas = filtradas.filter((a) => a.nivel >= 2).sort((a, b) => b.nivel - a.nivel);
  const porConfirmar = filtradas.filter((a) => a.nivel === 1);
  const abierta = alertas.find((a) => a.id === abiertaId);

  return (
    <LayoutGroup>
      <CabeceraPagina
        titulo="Alertas activas"
        intro="Lo que tus vecinos están viendo ahora. Confirma lo que también ves y marca lo que es falso."
      >
        <button type="button" className="btn btn-accion" onClick={() => abrirReporte()}>
          <Plus weight="bold" aria-hidden="true" />
          Reportar algo nuevo
        </button>
      </CabeceraPagina>

      <div className={`contenedor ${css.cuerpo}`}>
        {modo === 'demo' && (
          <p className={css.aviso}>
            Modo demostración: estas alertas son ejemplos. Puedes votar para ver cómo cambia el semáforo; nada se guarda.
          </p>
        )}
        {error && (
          <p className={css.error} role="alert">
            {error}
          </p>
        )}

        <FiltrosAlertas sector={sector} tipo={tipo} onSector={setSector} onTipo={setTipo} />

        <section aria-labelledby="activas" className={css.grupo}>
          <h2 id="activas" className={css.subtitulo}>
            Se están difundiendo <span className={css.cuenta}>{activas.length}</span>
          </h2>
          {cargando ? (
            <div className={css.esqueletos} aria-busy="true" aria-label="Cargando alertas">
              {[0, 1, 2].map((i) => (
                <div key={i} className={css.esqueleto} />
              ))}
            </div>
          ) : activas.length === 0 ? (
            <p className={css.vacio}>No hay alertas activas con estos filtros. Todo tranquilo por ahora.</p>
          ) : (
            <Rejilla alertas={activas} onAbrir={setAbiertaId} ahora={ahora} />
          )}
        </section>

        <section aria-labelledby="por-confirmar" className={css.grupo}>
          <h2 id="por-confirmar" className={css.subtitulo}>
            Por confirmar <span className={css.cuenta}>{porConfirmar.length}</span>
          </h2>
          <p className={css.explicacion}>
            Un solo vecino lo reportó. Todavía no se difunde: si tú también lo ves, confírmalo.
          </p>
          {!cargando && porConfirmar.length === 0 ? (
            <p className={css.vacio}>Nada pendiente de confirmar.</p>
          ) : (
            <Rejilla alertas={porConfirmar} onAbrir={setAbiertaId} ahora={ahora} />
          )}
        </section>
      </div>

      <Modal abierto={Boolean(abierta)} onCerrar={() => setAbiertaId(null)} idTitulo={idTitulo}>
        {abierta && <DetalleAlerta alerta={abierta} idTitulo={idTitulo} ahora={ahora} />}
      </Modal>
    </LayoutGroup>
  );
}
