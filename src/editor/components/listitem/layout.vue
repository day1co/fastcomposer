<template>
  <li class="composer-listitem-layout composer-listitem">
    <composer-layout-info :layout="layout"></composer-layout-info>
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
    layout: Object
  }
}

</script>
