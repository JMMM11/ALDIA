import css from './Logo.module.css';

// Marca provisional. Cuando Josh entregue el logo de Canva, reemplazar el <svg>
// y el texto por <img src={logo} width height alt="FLUYA">.
export default function Logo() {
  return (
    <span className={css.logo}>
      <svg viewBox="0 0 64 64" aria-hidden="true" className={css.marca}>
        <rect width="64" height="64" rx="16" className={css.fondo} />
        <path d="M14 40c6-6 12-6 18 0s12 6 18 0" fill="none" className={css.ola} strokeWidth="5" strokeLinecap="round" />
        <circle cx="32" cy="22" r="7" className={css.punto} />
      </svg>
      <span className={css.texto}>FLUYA</span>
    </span>
  );
}
