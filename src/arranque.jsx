import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Router } from 'wouter';
import { MotionConfig } from 'motion/react';
import './styles/tokens.css';
import './styles/base.css';
import { DatosProvider } from './context/DatosContext.jsx';
import App from './App.jsx';

// En GitHub Pages BASE_URL es "/<repo>/"; el enrutador lo quiere sin la barra final.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router base={base}>
      {/* reducedMotion="user": quien desactiva el movimiento en su sistema no ve desplazamientos */}
      <MotionConfig reducedMotion="user">
        <DatosProvider>
          <App />
        </DatosProvider>
      </MotionConfig>
    </Router>
  </StrictMode>,
);
