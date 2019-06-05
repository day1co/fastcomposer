<template>
  <!--css로 hover걸어서 처리해보는걸로...-->
  <div class="layer-preview-container">
    <div class="btn-group">
      <button type="button" class="btn" @click="removeLayer"><i class="fas fa-trash-alt"></i></button>
      <button type="button" class="btn row-drag-handle"><i class="fas fa-bars"></i></button>
    </div>
    <div
      :id="layer.id"
      @click="$emit('selectPreview')"
      class="fc-layer-preview fc-block fc-layout"
      :class="['fc-layout-' + layer.layout.id, { active: active }, { hidden: this.layer.hidden }]"
      v-html="html"
    ></div>
  </div>
</template>

<script>
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
  watch: {
    active(value) {
      value && this.$el.scrollIntoViewIfNeeded();
    },
  },
  methods: {
    removeLayer() {
      this.$emit('removeLayer', this.layer, this.index);
    }
  }
};
</script>

<style lang="scss">
  @import '../../../assets/scss/utils/utilities.scss';
.layer-preview-container {
  position: relative;
  .btn-group {
    visibility: hidden;
    opacity: 0;
    /*transition: visibility 0s 0.1s;*/
    position: absolute;
    top:0;
    right: 0;
  }
  &:hover {
    .btn-group {
      visibility: visible!important;
      opacity: 1!important;
      transition: opacity 250ms linear;
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
