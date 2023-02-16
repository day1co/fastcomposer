import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteRawPlugin from 'vite-plugin-raw'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteRawPlugin({
      match: /\.(ejs|svg)$/i
    })
  ],
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      sass: {
        additionalData: `@import '@/editor/styles/_variables.sass'\n`
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true
  }
})
