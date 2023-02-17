<template>
  <composer-input-list
    v-if="param.type === 'list'"
    :layer="layer"
    :path="path"
    :param="param">
  </composer-input-list>
  <component
    v-else
    :is="component"
    v-model="value">
  </component>
</template>

<script>

import ComposerInputText from './text.vue'
import ComposerInputNumber from './number.vue'
import ComposerInputSelect from './select.vue'
import ComposerInputFile from './file.vue'
import ComposerInputTextarea from './textarea.vue'
import ComposerInputList from './list.vue'

export default {
  props: {
    layer: Object,
    path: Object,
    param: Object
  },
  components: {
    ComposerInputList
  },
  computed: {
    component() {
      switch(this.param?.type) {
        case 'number':
          return ComposerInputNumber
        case 'select':
          return ComposerInputSelect
        case 'textarea':
          return ComposerInputTextarea
        case 'file':
        case 'image':
          return ComposerInputFile
        default:
          return ComposerInputText
      }
    },
    value: {
      get() {
        return this.layer.get(this.path)
      },
      set(v) {
        this.$composer.state.improvise('layer.edit', this.path, v)
      }
    }
  }
}

</script>
