import { motion } from 'motion/react';
import Foto from './Foto.jsx';
import css from './CabeceraPagina.module.css';

export default function CabeceraPagina({ titulo, intro, foto, children }) {
  return (
    <header className={`contenedor ${css.cabecera} ${foto ? css.conFoto : ''}`}>
      <motion.div
        className={css.texto}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className={css.titulo}>{titulo}</h1>
        {intro && <p className="intro">{intro}</p>}
        {children}
      </motion.div>
      {foto && (
        <motion.div
          className={css.marco}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Foto foto={foto} prioridad className={css.foto} sizes="(max-width: 900px) 100vw, 45vw" />
        </motion.div>
      )}
    </header>
  );
}
