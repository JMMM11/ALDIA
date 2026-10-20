import { useEffect, useState } from 'react';

// Refresca cada minuto los textos tipo "hace 5 minutos".
export function useAhora() {
  const [ahora, setAhora] = useState(Date.now);
  useEffect(() => {
    const id = setInterval(() => setAhora(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  return ahora;
}
