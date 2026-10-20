import { createContext, useContext } from 'react';

// Permite abrir el formulario de reporte desde cualquier botón del sitio.
export const ReporteContext = createContext({ abrirReporte: () => {} });
export const useReporte = () => useContext(ReporteContext);
