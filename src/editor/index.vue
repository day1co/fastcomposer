<template>
  <div class="composer-root">
    <composer-navbar></composer-navbar>

    <div class="composer-editor-wrap">
      <aside class="composer-sidebar left">
        <composer-pane title="레이아웃">
          <ul class="composer-pane-content inner-border composer-pane-tree">
            <composer-item-group title="리거시" opened>
              <composer-item-layout
                v-for="[key, layout] of layouts"
                :key="key"
                :layout="layout"
                @dblclick="improvise('layer.new', null, layout.id)"></composer-item-layout>
            </composer-item-group>
          </ul>
        </composer-pane>
        <composer-pane title="레이어">
          <ul class="composer-pane-content inner-border composer-pane-tree">
            <composer-item-layer
              v-for="(layer, key) in layers"
              :key="key"
              :layer="layer"
              @click="focus = layer.path"
              :focused="focus.includes(layer.path)"></composer-item-layer>
          </ul>
        </composer-pane>
      </aside>
      <main>
        content
      </main>
      <aside class="composer-sidebar right">
        <composer-pane title="히스토리">
          <ul class="composer-pane-content inner-border composer-pane-tree">
            <composer-item-history
              v-for="history in pastHistory"
              :key="history.id"
              :act="history"></composer-item-history>
            <composer-item-history
              v-for="history in futureHistory"
              :key="history.id"
              :act="history"
              future></composer-item-history>
          </ul>
        </composer-pane>
        <composer-pane title="레이어 속성">
          <form class="composer-pane-content" @submit.prevent.stop>
            <composer-input-text title="집에 가고 싶다" placeholder="으어어"></composer-input-text>
            <composer-input-text title="내일의 일을" placeholder="내일로 미루자!"></composer-input-text>
            <composer-input-number title="모레의 일을" placeholder="1234"></composer-input-number>
            <composer-input-select title="글피의 일을" placeholder="1234"></composer-input-select>
            <composer-input-file title="이거됨??" placeholder="1234"></composer-input-file>
            <composer-input-textarea title="진짜 집에 가고 싶다" placeholder="으어어"></composer-input-textarea>
          </form>
        </composer-pane>
      </aside>
    </div>
  </div>
</template>

<script>

import Page from '../page'
import State from '../state'

import ComposerNavbar from './components/navbar/index.vue'
import ComposerPane from './components/pane/index.vue'
import ComposerItemHistory from './components/listitem/history.vue'
import ComposerItemLayer from './components/listitem/layer.vue'
import ComposerItemLayout from './components/listitem/layout.vue'
import ComposerItemGroup from './components/listitem/group.vue'

import ComposerInputText from './components/form/text.vue'
import ComposerInputNumber from './components/form/number.vue'
import ComposerInputSelect from './components/form/select.vue'
import ComposerInputFile from './components/form/file.vue'
import ComposerInputTextarea from './components/form/textarea.vue'

export default {
  name: 'ComposerRoot',
  components: {
    ComposerNavbar,
    ComposerPane,
    ComposerItemHistory,
    ComposerItemLayer,
    ComposerItemLayout,
    ComposerItemGroup,
    ComposerInputText,
    ComposerInputNumber,
    ComposerInputSelect,
    ComposerInputFile,
    ComposerInputTextarea
  },
  data: () => ({
    page: null,
    state: null,
    focus: null
  }),
  methods: {
    improvise(actionName, target, arg) {
      const resultedAct = this.state.improvise(actionName, target, arg)
      this.focus = resultedAct.destination
    }
  },
  computed: {
    layouts() {
      return this.page?._layouts ?? new Map()
    },
    layers() {
      return this.page?.state ?? []
    },
    pastHistory() {
      return this.state._history
    },
    futureHistory() {
      return this.state._future
    }
  },
  created() {
    if(!this.page) // TODO: preload
      this.page = globalThis.page = new Page(this.$composerOptions.layouts)
    // TODO: restore redo/undo state?
    this.state = globalThis.state = new State({ modules: { page: this.page } })
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
