import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  
  return {
    base: mode === 'production' ? env.VITE_APP_ROUTE : '/',
    build: {
      outDir: 'build',
    },
    plugins: [
      react()],
    server: {
      host: '0.0.0.0',
      port: env.VITE_PORT || 5173,
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/test/setup.js',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

  }
})