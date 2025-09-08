import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    define: {
      'process.env': {}
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        // Proxy API requests to the backend server
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    // Make environment variables available to the client
    envDir: '.',
    envPrefix: 'VITE_', // Only variables with this prefix will be exposed to the client
  }
})
