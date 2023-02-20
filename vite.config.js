import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import string from 'vite-plugin-string'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    string({
      include: [
        '**/*.ejs',
        '**/*.svg'
      ],
      // exclude: 'node_modules/**',
      compress(payload) {
        return payload.replaceAll(/\s+/g, ' ')
      }
    }),
    vue()
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
