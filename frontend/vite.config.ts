import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    port: 3000,
    proxy: {
      "/graph": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      },
      "/search": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      },
      "/blogs": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      },
      "/concepts": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
