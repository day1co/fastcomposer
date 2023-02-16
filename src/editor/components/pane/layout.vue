<template>
  <composer-pane title="레이아웃">
    <ul class="composer-pane-content inner-border composer-pane-tree">
      <composer-item-group title="리거시" opened>
        <composer-item-layout
          v-for="[key, layout] of page.layouts"
          :key="key"
          :layout="layout"
          @dblclick="createNewLayer(layout)"></composer-item-layout>
      </composer-item-group>
    </ul>
  </composer-pane>
</template>

<script>

import ComposerPane from './index.vue'

import ComposerItemGroup from '../listitem/group.vue'
import ComposerItemLayout from '../listitem/layout.vue'

export default {
  components: {
    ComposerPane,
    ComposerItemGroup,
    ComposerItemLayout
  },
  methods: {
    createNewLayer(layout) {
      const resultedAct = this.$composer.state.improvise(
        'layer.new',
        this.$composer.focus,
        layout.id
      )
       this.$composer.focus = resultedAct.destination
    }
  },
  computed: {
    page() {
      return this.$composer.page
    },
    state() {
      return this.$composer.state
    }
  }
}

</script>
