<template>
  <div class="composer-edit-wrap" @submit.prevent>
    <composer-edit-entry
      v-for="[key, param] of params"
      :layer="layer"
      :path="this.path.withChild(key)"
      :param="param">
    </composer-edit-entry>
  </div>
</template>

<script>

import ComposerEditEntry from './entry.vue';

export default {
  components: {
    ComposerEditEntry
  },
  props: {
    layer: Object,
    path: Object,
    params: Map
  }
}

</script>
