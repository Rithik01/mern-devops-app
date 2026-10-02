import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // host: true => listen on 0.0.0.0 so it is reachable from inside Docker
    host: true,
  },
  preview: {
    port: 5173,
    host: true,
  },
});
