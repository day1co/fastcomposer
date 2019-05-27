<template>
  <pane :title="`layer`" :width="width" :height="'50%'">
    <Container @drop="onDrop" drag-handle-selector=".row-drag-handle">
      <Draggable v-for="(layer, index) in layers" :key="layer.id">
        <list-item
          :title="layer.layout.id"
          :description="layer.layout.description"
          :icon="layer.layout.icon"
          :active="selectedLayer.id === layer.id"
          @onClick="selectLayer(layer)"
        >
          <button @click="removeLayer(layer, index)">
            <i class="fas fa-trash-alt"></i>
          </button>
          <button class="row-drag-handle"><i class="fas fa-bars"></i></button>
        </list-item>
      </Draggable>
    </Container>
  </pane>
</template>

<script>
  import { Container, Draggable } from "vue-smooth-dnd";
  import Pane from './pane.vue';
  import ListItem from './list-item.vue';

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
    name: 'layer',
    components: {
      Pane,
      ListItem,
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
      width: {
        type: String,
        default: '100%',
      },
      selectedLayer: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    methods: {
      onDrop(dropResult) {
        this.layers = applyDrag(this.layers, dropResult);
      },
      selectLayer(layer) {
        this.$emit('select', layer);
      },
      removeLayer(layer, layerIndex) {
        if (layerIndex!== -1) {
          this.layers.splice(layerIndex, 1);
          this.selectLayer(layer);
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>
