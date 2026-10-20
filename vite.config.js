import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// En GitHub Pages el sitio vive en /<nombre-del-repo>/. El flujo de despliegue
// define BASE_PATH; en local se usa la raíz.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
});
