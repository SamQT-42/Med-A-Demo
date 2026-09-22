import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Frontend only. No API, no proxy, no server.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { port: 5173 },
  preview: { port: 4173 },
});
