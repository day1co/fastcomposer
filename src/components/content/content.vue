<template>
  <div class="fc-composer__content">
<!--    <preview-->
<!--      :layers="layers"-->
<!--      :selectedLayer="selectedLayer"-->
<!--      @select="onSelectLayer"-->
<!--      @toggleLayerKit="onToggleLayerKit"-->
<!--    />-->
<!--    <Layout :layouts="layoutArray" :width="`18rem`"-->
<!--            @removeSelectedLayer="onRemoveSelectedLayer"-->
<!--            @select="onSelectLayout"-->
<!--    />-->
  </div>
</template>

<script>
  import { cloneDeep } from 'lodash';
  // import Preview from '../../components/content/preview.vue';
  // import Layout from '../../components/layout.vue';
  import { Draggable } from 'draggable-vue-directive';
  export default {
    name: 'composer-content',
    directives: {
      Draggable
    },
    components: {
      // Preview,
      // Layout,
    },
    /**
     * 중복
     */
    props: {
      value: {
        type: String,
        default: '[]',
      },
      layouts: {
        type: Array,
        default() {
          return [];
        },
      }
    },
    data() {
      return  {
        editorLayoutIndex: -1,
      }
    },
    methods: {
      onSelectLayer(selectLayer) {
        const selectLayerIndex = this.layers.indexOf(selectLayer);
        this.editorLayoutIndex = selectLayerIndex;
      },
      onToggleLayerKit() {

      },
      onRemoveSelectedLayer() {
        this.editorLayoutIndex = -1;
      },
      onSelectLayout(layout) {
        const layer = {
          id: this.nextLayerId(),
          layout: layout,
          values: cloneDeep(layout.values) || {}, // clone!! not ref!
        };
        this.addLayer(layer);
        this.onSelectLayer(layer);
      },
    }
  }
</script>

<style lang="scss">

</style>
