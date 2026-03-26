import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://inventorypos-xxeq.onrender.com',
        changeOrigin: true
      }
    }
  }
});
