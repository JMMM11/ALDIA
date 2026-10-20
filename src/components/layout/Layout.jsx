import { Suspense, lazy, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'motion/react';
import { ReporteContext } from '../../context/ReporteContext.jsx';
import Modal from '../ui/Modal.jsx';
import Header from './Header.jsx';
import NavMovil from './NavMovil.jsx';
import Footer from './Footer.jsx';
import css from './Layout.module.css';

// El formulario se descarga recién cuando alguien abre "Reportar".
const FormularioReporte = lazy(() => import('../alertas/FormularioReporte.jsx'));

export default function Layout({ children }) {
  const [pathname] = useLocation();
  const esInicio = pathname === '/';
  const idTitulo = useId();
  const [reporte, setReporte] = useState({ abierto: false, tipo: '', vez: 0 });
  const main = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const abrirReporte = useCallback((tipo = '') => setReporte((r) => ({ abierto: true, tipo, vez: r.vez + 1 })), []);
  const cerrarReporte = useCallback(() => setReporte((r) => ({ ...r, abierto: false })), []);
  const contexto = useMemo(() => ({ abrirReporte }), [abrirReporte]);

  return (
    <ReporteContext.Provider value={contexto}>
      {/* Las rutas usan el # de la URL, así que el salto se hace moviendo el foco */}
      <a
        href="#contenido"
        className="saltar"
        onClick={(e) => {
          e.preventDefault();
          main.current.focus();
        }}
      >
        Saltar al contenido
      </a>
      <Header sobreFoto={esInicio} />

      <main ref={main} id="contenido" tabIndex={-1} className={esInicio ? css.mainInicio : css.main}>
        <Suspense fallback={<div className={css.cargando} aria-busy="true" />}>
          <motion.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
            {children}
          </motion.div>
        </Suspense>
      </main>

      <Footer />
      <NavMovil />

      <Modal abierto={reporte.abierto} onCerrar={cerrarReporte} idTitulo={idTitulo}>
        <Suspense fallback={<p aria-busy="true">Cargando formulario…</p>}>
          <FormularioReporte key={reporte.vez} tipoInicial={reporte.tipo} idTitulo={idTitulo} onListo={cerrarReporte} />
        </Suspense>
      </Modal>
    </ReporteContext.Provider>
  );
}
