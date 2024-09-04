import path from 'node:path'
import { defineConfig, mergeConfig } from 'vite'
import config from '../_vite.config.mjs'

export default defineConfig(
  mergeConfig(config(__dirname), {
    build: {
      lib: {
        entry: {
          index: path.join(__dirname, './index.ts'),
          layouts: path.join(__dirname, './layouts/index.ts'),
          structs: path.join(__dirname, './structs/index.ts'),
        },
      },
    }
  })
)
