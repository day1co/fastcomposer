<template>
  <composer-pane title="레이어">
    <ul class="composer-pane-content inner-border composer-pane-tree">
      <composer-item-layer
        v-for="(layer, key) in $composer.page.state"
        :key="key"
        :layer="layer"
        @click="$composer.focus = layer.path"
        :class="{ focused: $composer.focus?.includes(layer.path) }"></composer-item-layer>
    </ul>
  </composer-pane>
</template>

<script>

import ComposerPane from './index.vue'

import ComposerItemGroup from '../listitem/group.vue'
import ComposerItemLayer from '../listitem/layer.vue'

export default {
  components: {
    ComposerPane,
    ComposerItemGroup,
    ComposerItemLayer
  }
}

</script>
