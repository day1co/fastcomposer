<template>
  <div class="layer-preview-container">
    <div
      :id="layer.id"
      @click="selectedLayer(layer)"
      class="fc-layer-preview fc-block fc-layout"
      :class="['fc-layout-' + layer.layout.id, { active: active }, { hidden: this.layer.hidden }]"
      v-html="html"
    ></div>
    <div class="fc-block__utils">
      <button class="fc-block__utils__btn" @click="removeLayer(layer, index)">
        <i class="material-icons">&#xE872;</i>
      </button>
      <button class="fc-block__utils__btn row-drag-handle">
        <i class="material-icons">drag_handle</i>
      </button>
    </div>
  </div>
</template>

<script>
import EventBus from './../../../event-bus/event-bus';
import marked from 'marked';

export default {
  name: 'layer-preview',
  props: {
    layer: {
      type: Object,
      default(){
        return {}
      }
    },
    zoom: {
      type: Number,
      default: 0
    },
    active: {
      type: Boolean,
      default:  false
    },
    index: Number,
  },
  computed: {
    html() {
      return this.layer.layout.templateFunc({ $markdown: marked, ...this.layer.values });
    },
  },
  methods: {
    removeLayer() {
      EventBus.$emit('removeLayer', this.layer, this.index);
    },
    selectedLayer(layer) {
      EventBus.$emit('selectedLayer', layer);
    }
  }
};
</script>

<style lang="scss">
@import '../../../assets/scss/utils/utilities.scss';
.layer-preview-container {
  position: relative;
  border-bottom: 1px solid #bbb;
  .btn-group {
    visibility: hidden;
    opacity: 0;
  }
  &:hover {
    .btn-group {
      visibility: visible!important;
      opacity: 1!important;
      transition: opacity 250ms linear;
    }
  }
  .fc-block {
    &__utils {
      position: absolute;
      right: 0;
      top: 0;
      background-color: #bbbbbb;
    }
  }
}
.fc-layer-preview {
  flex: 0 0 0;
  width: 100%;
  outline: 1px dashed lightgray;

  &.active {
    outline: 1px dashed fuchsia;
  }

  &.hidden {
    opacity: 0.5;
    background-color: olive;
  }
}
</style>
