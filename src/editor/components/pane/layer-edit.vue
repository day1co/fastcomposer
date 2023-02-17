<template>
  <composer-pane title="레이어 속성">
    <form
      v-if="currentLayer"
      class="composer-pane-content"
      @submit.prevent.stop>

      <!-- layout info -->
      <composer-layout-info
        :layout="currentLayer.layout"></composer-layout-info>

      <!-- parameters -->
      <composer-form
        :layer="currentLayer"
        :path="currentLayer.path"
        :params="currentLayer.layout.params"></composer-form>
    </form>
  </composer-pane>
</template>

<script>

import ComposerPane from './index.vue'

import ComposerItemGroup from '../listitem/group.vue'
import ComposerLayoutInfo from '../layout-info.vue'

import ComposerForm from '../form/index.vue'

export default {
  components: {
    ComposerPane,
    ComposerItemGroup,
    ComposerLayoutInfo,
    ComposerForm,
  },
  computed: {
    currentLayer() {
      if(!this.$composer.focus)
        return null

      return this.$composer.page.getLayerByPath(this.$composer.focus)
    }
  }
}

</script>
