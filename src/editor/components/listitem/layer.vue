<template>
  <li class="composer-listitem-layer composer-listitem">
    <composer-layout-info :layout="layer?.layout"></composer-layout-info>
    <slot></slot>
  </li>
</template>

<script>

import ComposerLayoutInfo from '../layout-info.vue'

export default {
  components: {
    ComposerLayoutInfo
  },
  props: {
    layer: Object
  }
}

</script>
