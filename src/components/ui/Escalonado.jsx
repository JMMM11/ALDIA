import { motion } from 'motion/react';

// Aparición escalonada al hacer scroll: los hijos entran uno tras otro.
const contenedor = { oculto: {}, visible: { transition: { staggerChildren: 0.07 } } };
const item = {
  oculto: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export function Escalonado({ as = 'div', children, ...props }) {
  const Componente = motion[as];
  return (
    <Componente variants={contenedor} initial="oculto" whileInView="visible" viewport={{ once: true, amount: 0.15 }} {...props}>
      {children}
    </Componente>
  );
}

export function ItemEscalonado({ as = 'div', ...props }) {
  const Componente = motion[as];
  return <Componente variants={item} {...props} />;
}
