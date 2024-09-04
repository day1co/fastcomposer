import process from 'node:process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import viteRawPlugin from 'vite-plugin-raw'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProd = process.env.NODE_ENV === 'production'

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
    optimizeDeps: isProd? {} : {
      exclude: ['@day1co/fastcomposer-layout', '@day1co/fastcomposer-page', '@day1co/fastcomposer-state']
    },
  },
  server: {
    port: 18080,
    host: '0.0.0.0'
  }
})
