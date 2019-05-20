<template>
  <div
    :id="layer.id"
    @click="$emit('selectPreview')"
    class="fc-layer-preview fc-block fc-layout"
    :class="['fc-layout-' + layer.layout.id, { active: active }, { hidden: this.layer.hidden }]"
    v-html="html"
  ></div>
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
};
</script>

<style lang="scss" scoped>
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
