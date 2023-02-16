<template>
  <composer-pane title="레이어 속성">
    <form class="composer-pane-content" @submit.prevent.stop>
      <!-- layout info -->
      {{ currentLayer }}
      <!-- parameters -->
      <composer-item-group title="데모">
        <composer-input-text title="집에 가고 싶다" placeholder="으어어"></composer-input-text>
        <composer-input-text title="내일의 일을" placeholder="내일로 미루자!"></composer-input-text>
        <composer-input-number title="모레의 일을" placeholder="1234"></composer-input-number>
        <composer-input-select title="글피의 일을" placeholder="1234"></composer-input-select>
        <composer-input-file title="이거됨??" placeholder="1234"></composer-input-file>
        <composer-input-textarea title="진짜 집에 가고 싶다" placeholder="으어어"></composer-input-textarea>
      </composer-item-group>
    </form>
  </composer-pane>
</template>

<script>

import ComposerPane from './index.vue'

import ComposerItemGroup from '../listitem/group.vue'

import ComposerInputText from '../form/text.vue'
import ComposerInputNumber from '../form/number.vue'
import ComposerInputSelect from '../form/select.vue'
import ComposerInputFile from '../form/file.vue'
import ComposerInputTextarea from '../form/textarea.vue'

export default {
  components: {
    ComposerPane,
    ComposerItemGroup,
    ComposerInputText,
    ComposerInputNumber,
    ComposerInputSelect,
    ComposerInputFile,
    ComposerInputTextarea
  },
  data: () => ({
    //
  }),
  computed: {
    currentLayer() {
      if(!this.$composer.focus) {
        return null
      }

      return this.$composer.page.getLayerByPath(this.$composer.focus)
    }
  }
}

</script>
