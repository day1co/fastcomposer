<template>
  <div class="composer-root">
    <composer-navbar></composer-navbar>

    <div class="composer-editor-wrap">
      <aside class="composer-sidebar left">
        <composer-pane-layout></composer-pane-layout>
        <composer-pane-layers></composer-pane-layers>
      </aside>
      <main>
        content
      </main>
      <aside class="composer-sidebar right" style="width: 480px">
        <composer-pane-history></composer-pane-history>
        <composer-pane-layer-edit></composer-pane-layer-edit>
      </aside>
    </div>
  </div>
</template>

<script>

import ComposerNavbar from './components/navbar/index.vue'
import ComposerPane from './components/pane/index.vue'

import ComposerPaneLayout from './components/pane/layout.vue'
import ComposerPaneLayers from './components/pane/layers.vue'
import ComposerPaneHistory from './components/pane/history.vue'
import ComposerPaneLayerEdit from './components/pane/layer-edit.vue'

export default {
  name: 'ComposerRoot',
  components: {
    ComposerNavbar,
    ComposerPane,
    ComposerPaneLayout,
    ComposerPaneLayers,
    ComposerPaneHistory,
    ComposerPaneLayerEdit
  },
  created() {
    globalThis.component = this
  }
}

</script>

<style lang="sass">

.composer-editor-wrap
  display: flex
  align-content: stretch

  width: 100vw
  height: 100vh

  padding-top: var(--c-navbar-size)

  > main
    flex-grow: 1

</style>
