import path from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import viteRawPlugin from 'vite-plugin-raw'

export default dirname => defineConfig({
  root: dirname,
  plugins: [
    dts(),
    viteRawPlugin({
      match: /\.(ejs|svg)$/i
    })
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: {
        index: path.join(dirname, './index.ts')
      },
      formats: ['es']
    }
  }
})
