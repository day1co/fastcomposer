<template>
  <div>
    <!--구조상 btn-group영역을 이곳에 두는것이 맞는지...-->
    <div class="btn-group-toggle" data-toggle="buttons">
      <button type="button" class="btn btn-primary" @click="toggleLayerKits">Layer Kits on/off</button>
      <button type="button" class="btn btn-primary" @click="toggleLayers">Layers on/off</button>
    </div>
    <pane :title="`preview`">
      <template>
        <main :style="{ zoom }">
          <Container @drop="onDrop" drag-handle-selector=".row-drag-handle" :animation-duration="200">
            <Draggable v-for="(layer, layerIndex) in layers" :key="layer.id">
              <layer-preview
                :key="'layer-' + layerIndex"
                :layer="layer"
                @selectPreview="$emit('select',layer)"
                :active="selectedLayer.id === layer.id">
              </layer-preview>
            </Draggable>
          </Container>
        </main>
      </template>
    </pane>
  </div>
</template>

<script>
  import LayerPreview from './layer-preview.vue';
  import pane from './pane.vue';
  import { Container, Draggable } from "vue-smooth-dnd";

  const applyDrag = (arr, dragResult) => {
    const { removedIndex, addedIndex, payload } = dragResult;
    if (removedIndex === null && addedIndex === null) return arr;

    const result = arr;
    let itemToAdd = payload;

    if (removedIndex !== null) {
      itemToAdd = result.splice(removedIndex, 1)[0];
    }

    if (addedIndex !== null) {
      result.splice(addedIndex, 0, itemToAdd);
    }

    return result;
  };

  export default {
    name: 'preview',
    components: {
      LayerPreview,
      pane,
      Container,
      Draggable,
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
        isLayerKit: true,
        isLayer: true
      };
    },
    methods: {
      zoomIn() {
        this.zoom = Math.min(this.zoom + 0.25, 2);
      },
      zoomOut() {
        this.zoom = Math.max(this.zoom - 0.25, 0.25);
      },
      onDrop(dropResult) {
        this.layers = applyDrag(this.layers, dropResult);
      },
      toggleLayerKits() {
        this.$emit('toggleLayerKit');
      },
      toggleLayers() {
        this.$emit('toggleLayer');
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
