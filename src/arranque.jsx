import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Router } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { MotionConfig } from 'motion/react';
import './styles/tokens.css';
import './styles/base.css';
import { DatosProvider } from './context/DatosContext.jsx';
import App from './App.jsx';

// Rutas con # (#/alertas): funcionan igual con Go Live, GitHub Pages o cualquier
// servidor estático, sin configurar redirecciones.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router hook={useHashLocation}>
      {/* reducedMotion="user": quien desactiva el movimiento en su sistema no ve desplazamientos */}
      <MotionConfig reducedMotion="user">
        <DatosProvider>
          <App />
        </DatosProvider>
      </MotionConfig>
    </Router>
  </StrictMode>,
);
