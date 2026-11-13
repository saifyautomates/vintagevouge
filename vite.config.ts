import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vintageApiServerPlugin } from './src/backend/api/serverMiddleware';

export default defineConfig({
  plugins: [react(), vintageApiServerPlugin()],
  server: {
    port: 1234,
    strictPort: true,
    host: true
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          lucide: ['lucide-react']
        }
      }
    }
  }
});
