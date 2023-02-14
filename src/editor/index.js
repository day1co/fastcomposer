import { createApp } from 'vue'

import ComposerRoot from './index.vue'

export default function Composer(options) {

  const rootvm = globalThis.rootvm = createApp(ComposerRoot)

  rootvm.config.globalProperties.$composerOptions = {
    layouts: options.layouts
  }

  if(options.mountAt) {
    rootvm.mount(options.mountAt)
  }

  return rootvm
}
