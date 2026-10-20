import { AnimatePresence, motion } from 'motion/react';
import { Moon, Sun } from '@phosphor-icons/react';
import { useTema } from '../../hooks/useTema.js';

export default function BotonTema({ className, conTexto = false }) {
  const { tema, alternar } = useTema();
  const oscuro = tema === 'dark';
  const Icono = oscuro ? Sun : Moon;
  const texto = oscuro ? 'Usar tema claro' : 'Usar tema oscuro';

  return (
    <button type="button" className={className} onClick={alternar} aria-label={conTexto ? undefined : texto}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={tema}
          style={{ display: 'grid' }}
          initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
          transition={{ duration: 0.2 }}
        >
          <Icono weight="bold" aria-hidden="true" />
        </motion.span>
      </AnimatePresence>
      {conTexto && <span>{texto}</span>}
    </button>
  );
}
