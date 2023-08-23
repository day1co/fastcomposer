import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

export default defineConfig({
  root: __dirname,
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  lib: {
    entry: path.join(__dirname, './src/index.js'),
    formats: ['es', 'cjs']
  },
  server: {
    port: 18080,
    host: '0.0.0.0'
  }
})
