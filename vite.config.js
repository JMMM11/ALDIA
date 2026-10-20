import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// El código fuente vive en src/ (con su propio index.html para `npm run dev`).
// `npm run build` deja la web lista en la raíz del repositorio: index.html,
// assets/, fotos/ y fuentes/. Así se abre directo con Go Live (Live Server) y
// GitHub Pages la publica desde la rama, sin configuración extra.
// base './' hace que todas las rutas sean relativas: funciona en cualquier carpeta.
export default defineConfig({
  root: 'src',
  base: './',
  publicDir: '../public',
  envDir: '..',
  plugins: [react()],
  build: {
    outDir: '..',
    emptyOutDir: false, // nunca vaciar la raíz del proyecto
  },
});
