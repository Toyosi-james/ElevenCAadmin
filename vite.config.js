import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env so VITE_API_PROXY_TARGET is available when configuring the dev proxy.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],

    server: {
      /**
       * Dev-only proxy: browser calls /api/... on the Vite origin (e.g. :5173),
       * Vite forwards to your real backend so you avoid CORS during development.
       *
       * Set VITE_API_PROXY_TARGET in .env (optional).
       * In production builds, set VITE_API_BASE_URL instead (or host API on same origin).
       */
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  }
})
