<template>
  <pane :title="`preview`">
    <main :style="{ zoom }">
      <block-preview
        v-for="(layer, layerIndex) in layers"
        :key="'layer-' + layerIndex"
        :block="layer"
        :active="selectedLayer.id === layer.id">
      </block-preview>
    </main>
  </pane>
  <!--<button @click="zoomIn"><i class="fas fa-search-plus"></i></button>
    <button @click="zoomOut"><i class="fas fa-search-minus"></i></button>-->
</template>

<script>
  import BlockPreview from './layer-preview.vue';
  import pane from './pane.vue';

  export default {
    name: 'preview',
    components: {
      BlockPreview,
      pane,
    },
    props: {
      layers: {
        type: Array,
        default() {
          return [];
        },
      },
      selectedLayer: {
        type: Object,
        default(){
          return {};
        }
      },
    },
    data() {
      return {
        zoom: 1,
      };
    },
    methods: {
      zoomIn() {
        this.zoom = Math.min(this.zoom + 0.25, 2);
      },
      zoomOut() {
        this.zoom = Math.max(this.zoom - 0.25, 0.25);
      },
    },
  };
</script>

<style lang="scss">
  .fc-preview {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;

    > header {
      display: flex;
      flex: 0 0 2rem;
      height: 2rem;

      h3 {
        flex: 1 1 0;
        margin: 0;
        padding: 0;
      }

      button {
        flex: 0 0 2rem;
        width: 2rem;
        height: 2rem;
        text-align: center;
      }
    }

    > main {
      display: flex;
      flex-direction: column;
      flex: 1 1 0;
      overflow: scroll;
      padding: 1rem;
      transform-origin: top left;
    }
  }
</style>
