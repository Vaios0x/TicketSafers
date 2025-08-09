import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: process.cwd(),
  base: './',
  server: {
    port: 3000,
    hmr: true
  },
  resolve: {
    dedupe: ['mapbox-gl', 'react-map-gl']
  },
  optimizeDeps: {
    include: ['mapbox-gl', 'react-map-gl']
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: fileURLToPath(new URL('./index.html', import.meta.url))
    }
  },
  define: {
    // Suprimir warnings de desarrollo de Lit
    __LIT_DEV_MODE__: false
  }
}) 