<template>
  <div class="fc-composer__content">
<!--    <preview-->
<!--      :layers="layers"-->
<!--      :selectedLayer="selectedLayer"-->
<!--      @select="onSelectLayer"-->
<!--      @toggleLayerKit="onToggleLayerKit"-->
<!--    />-->
<!--    <sidebar-pane :layoutKits="layoutKits" :width="`18rem`"-->
<!--            @removeSelectedLayer="onRemoveSelectedLayer"-->
<!--            @select="onSelectLayout"-->
<!--    />-->
    <composer-aside
      :layoutKits="layoutKits"
      @toggleMenu="onToggleMenu"
      @removeSelectedLayer="onRemoveSelectedLayer"
      @select="onSelectLayout"
    />
  </div>
</template>

<script>
  import { cloneDeep } from 'lodash';
  // import Preview from '../../components/content/preview.vue';
  import { Draggable } from 'draggable-vue-directive';
  import ComposerAside from './aside/aside';
  export default {
    name: 'composer-content',
    directives: {
      Draggable
    },
    components: {
      ComposerAside,
      // Preview,
      // SidebarPane,
    },
    props: {
      layoutKits: {
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
      addLayer() {
        console.log('addLayer!!!');
        // this.layers.push(layer);
      },
      nextLayerId() {
        const seq = (this._blockIdSeq = this._blockIdSeq ? ++this._blockIdSeq : 1);
        const nonce = Math.random()
          .toString(36)
          .substr(2, 9);
        return `fc-block-${seq}-${nonce}`;
      },
      // 레이터 data 컨트롤 영역
      onSelectLayer(selectLayer) {
        const selectLayerIndex = this.layoutKits.indexOf(selectLayer);
        this.editorLayoutIndex = selectLayerIndex;
      },
      onToggleLayerKit() {
        this.isLayerKit = !this.isLayerKit;
      },
      onRemoveSelectedLayer() {
        this.editorLayoutIndex = -1;
      },
      // 레이아웃 컨트롤 영역
      onSelectLayout(layoutKits) {
        const layer = {
          id: this.nextLayerId(),
          layout: layoutKits,
          values: cloneDeep(layoutKits.values) || {}, // clone!! not ref!
        };
        this.addLayer(layer);
        this.onSelectLayer(layer);
      },
      onToggleMenu() {
        this.$emit('toggleMenu');
      }
    }
  }
</script>

<style lang="scss">

</style>
