<template>
  <pane :title="`layer`" :width="width" :height="'50%'">
    <div v-for="(layer, index) in layers" :key="index">
      <list-item
        :title="layer.layout.id"
        :description="layer.layout.description"
        :icon="layer.layout.icon"
        :active="layer.layout.hidden"
        @onClick="selectLayer(layer)"
      >
        <button v-if="layer.hidden" @click="toggleShow(index, false)">
          <i class="fas fa-eye-slash"></i>
        </button>
        <button v-if="!layer.hidden" @click="toggleShow(index, true)">
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
  import Pane from '../components/pane.vue';
  import ListItem from '../components/list-item.vue';

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
        }
      },
      width: {
        type: String,
        default: '100%',
      },
    },
    methods: {
      selectLayer(layer) {
        this.$emit('select', layer);
      },
      removeLayer(layer, layerIndex) {
        if (layerIndex!== -1) {
          this.layers.splice(layerIndex, 1);
          this.selectLayer(layer);
        }
      },
      upLayer(layer, layerIndex) {
        if (layerIndex > 0) {
          const tempLayer = this.layers[layerIndex];
          this.$set(this.layers, layerIndex, this.layers[layerIndex - 1]);
          this.$set(this.layers, layerIndex - 1, tempLayer);
        }
      },
      downLayer(layer, layerIndex) {
        if (layerIndex!== -1 && layerIndex < this.layers.length - 1) {
          const tempLayer = this.layers[layerIndex];
          this.$set(this.layers, layerIndex, this.layers[layerIndex + 1]);
          this.$set(this.layers, layerIndex + 1, tempLayer);
        }
      },
      toggleShow(layerIndex, isShow) {
        this.$set(this.layers[layerIndex], 'hidden', isShow);
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>
