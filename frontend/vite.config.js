import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: undefined
      },
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' || 
            (warning.message && warning.message.includes('use client'))) {
          return;
        }
        warn(warning);
      }
    }
  },
  optimizeDeps: {
    include: ['react-hot-toast']
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://inventorypos-xxeq.onrender.com',
        changeOrigin: true
      }
    }
  },
  define: {
    'process.env': {}
  }
});
