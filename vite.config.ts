import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

declare const process: any;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Base path defaults to '/dev/' (override via VITE_BASE_PATH if needed).
  const basePath = env.VITE_BASE_PATH || '/dev/';

  return {
    plugins: [react()],
    base: basePath,
    server: {
      port: 8090,
      host: '127.0.0.1',
      allowedHosts: true,
      proxy: {
        '/dev/api': {
          target: 'http://127.0.0.1:3002',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/dev\/api/, '/api'),
        },
        '/health/api': {
          target: 'http://127.0.0.1:3002',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/health\/api/, '/api'),
        },
        '/api': {
          target: 'http://127.0.0.1:3002',
          changeOrigin: true,
        },
      },
    },
  }
})