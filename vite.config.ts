import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  base: '/the-muskeeters-portfolio/',
  plugins: [react()],
  build: { sourcemap: true },
});
