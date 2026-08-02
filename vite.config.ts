import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

declare const process: any;

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Default base path to '/dev/' for local development.
  // Default to '/health_checker/' for production build (override via VITE_BASE_PATH if needed).
  const basePath = env.VITE_BASE_PATH || (command === 'build' ? '/health_checker/' : '/dev/');

  return {
    plugins: [react()],
    base: basePath,
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-recharts': ['recharts'],
            'vendor-icons': ['lucide-react'],
          },
        },
      },
    },
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
        '/health_checker/api': {
          target: 'http://127.0.0.1:3002',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/health_checker\/api/, '/api'),
        },
        '/api': {
          target: 'http://127.0.0.1:3002',
          changeOrigin: true,
        },
      },
    },
  }
})