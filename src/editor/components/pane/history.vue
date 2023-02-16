<template>
  <composer-pane title="히스토리">
    <ul class="composer-pane-content inner-border composer-pane-tree">
      <composer-item-history
        v-for="history in $composer.state.past"
        :key="history.id"
        :act="history"></composer-item-history>
      <composer-item-history
        v-for="history in $composer.state.future"
        :key="history.id"
        :act="history"
        future></composer-item-history>
    </ul>
  </composer-pane>
</template>

<script>

import ComposerPane from './index.vue'

import ComposerItemGroup from '../listitem/group.vue'
import ComposerItemHistory from '../listitem/history.vue'

export default {
  components: {
    ComposerPane,
    ComposerItemGroup,
    ComposerItemHistory
  }
}

</script>
