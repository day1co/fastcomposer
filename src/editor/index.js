import { createApp, reactive } from 'vue'

import ComposerRoot from './index.vue'

import Page from '../page'
import State from '../state'
import Path from '../page/path'

export default function Composer(options) {

  const rootvm = globalThis.rootvm = createApp(ComposerRoot)

  // rootvm.config.globalProperties.$composerOptions = {
  //   layouts: options.layouts
  // }

  const page = new Page(options.layouts)

  rootvm.config.globalProperties.$composer = reactive({
    page: page,
    state: new State({ modules: { page }}),
    focus: null
  })

  if(options.mountAt) {
    rootvm.mount(options.mountAt)
  }

  return rootvm
}
