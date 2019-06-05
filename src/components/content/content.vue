<template>
  <div class="fc-composer__content">
    <preview
      :layers="layers"
    />

    <composer-aside
      :layoutKits="layoutKits"
    />
  </div>
</template>

<script>
  import Preview from '../../components/content/preview/preview';
  import { Draggable } from 'draggable-vue-directive';
  import ComposerAside from './aside/aside';
  export default {
    name: 'composer-content',
    directives: {
      Draggable
    },
    components: {
      ComposerAside,
      Preview,
    },
    props: {
      layoutKits: {
        type: Array,
        default() {
          return [];
        },
      },
      layers: {
        type: Array,
        default() {
          return [];
        },
      }
    },
  }
</script>
