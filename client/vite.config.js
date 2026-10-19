import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      // Proxy backend API calls
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      // Proxy backend-uploaded image files
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
