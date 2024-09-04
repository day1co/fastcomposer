import { defineConfig, mergeConfig } from 'vite'
import config from '../_vite.config.mjs'

export default defineConfig(
  mergeConfig(config(__dirname), {})
)
