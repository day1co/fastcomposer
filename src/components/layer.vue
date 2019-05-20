<template>
  <pane :title="`layer`" :width="width" :height="'50%'">
    <div v-for="(layer, index) in layers" :key="index">
      <list-item
        :title="layer.layout.id"
        :description="layer.layout.description"
        :icon="layer.layout.icon"
        :active="selectedLayer.id === layer.id"
        @onClick="selectLayer(layer)"
      >
        <button v-if="layer.hidden" @click="toggleLayer(index, false)">
          <i class="fas fa-eye-slash"></i>
        </button>
        <button v-if="!layer.hidden" @click="toggleLayer(index, true)">
          <i class="fas fa-eye"></i>
        </button>
        <button @click="removeLayer(layer, index)">
          <i class="fas fa-trash-alt"></i>
        </button>
        <button @click="upLayer(layer, index)">
          <i class="fas fa-arrow-up"></i>
        </button>
        <button @click="downLayer(layer, index)">
          <i class="fas fa-arrow-down"></i>
        </button>
      </list-item>
    </div>
  </pane>
</template>

<script>
  import Pane from './pane.vue';
  import ListItem from './list-item.vue';

  export default {
    name: 'layer',
    components: {
      Pane,
      ListItem,
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
      selectLayer(layer) {
        this.$emit('select', layer);
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>
