import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { X } from '@phosphor-icons/react';
import css from './Modal.module.css';

// Diálogo con fondo desenfocado. Mientras está abierto, el resto de la página
// queda inerte (ni el teclado ni el lector de pantalla salen del diálogo).
// variante "hoja": sube desde abajo en el teléfono.
export default function Modal({ abierto, onCerrar, titulo, idTitulo, variante = 'centro', children }) {
  const panel = useRef(null);
  const regresoFoco = useRef(null);
  // Ref para no reiniciar el efecto (ni robar el foco) en cada render del padre.
  const cerrar = useRef(onCerrar);
  cerrar.current = onCerrar;

  useEffect(() => {
    if (!abierto) return;
    regresoFoco.current = document.activeElement;
    const raiz = document.getElementById('root');
    raiz.inert = true;
    document.body.style.overflow = 'hidden';
    const alTeclear = (e) => e.key === 'Escape' && cerrar.current();
    document.addEventListener('keydown', alTeclear);
    requestAnimationFrame(() => panel.current?.focus());
    return () => {
      raiz.inert = false;
      document.body.style.overflow = '';
      document.removeEventListener('keydown', alTeclear);
      regresoFoco.current?.focus?.();
    };
  }, [abierto]);

  return createPortal(
    <AnimatePresence>
      {abierto && (
        <div className={`${css.capa} ${css[variante]}`}>
          <motion.div
            className={css.fondo}
            onClick={onCerrar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.div
            ref={panel}
            className={css.panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={idTitulo}
            aria-label={idTitulo ? undefined : titulo}
            tabIndex={-1}
            initial={variante === 'hoja' ? { y: '100%' } : { opacity: 0, y: 24, scale: 0.98 }}
            animate={variante === 'hoja' ? { y: 0 } : { opacity: 1, y: 0, scale: 1 }}
            exit={variante === 'hoja' ? { y: '100%' } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          >
            <button type="button" className={css.cerrar} onClick={onCerrar} aria-label="Cerrar">
              <X weight="bold" aria-hidden="true" />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
