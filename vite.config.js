import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import viteRawPlugin from 'vite-plugin-raw'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: __dirname,
  plugins: [
    vue(),
    viteRawPlugin({
      match: /\.(ejs|svg)$/i
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    lib: {
      entry: path.join(__dirname, './src/legacy/index.js'),
      formats: ['es', 'cjs']
    },
  },
  server: {
    port: 18080,
    host: '0.0.0.0'
  }
})
