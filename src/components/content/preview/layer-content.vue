<template>
  <div class="fcc-layer">
    <div
      class="fcc-layer__container"
      :id="layer.id"
      :class="['fcc-layout-' + layer.layout.id, { active: active }, { hidden: layer.hidden }]"
      v-html="html"
    ></div>
  </div>
</template>

<script>
import marked from 'marked';

export default {
  props: {
    layer: {
      type: Object,
      default() {
        return {}
      }
    },
    active: {
      type: Boolean,
      default:  false
    },
    index: Number,
  },
  computed: {
    html() {
      for (const prop in this.layer.layout.values) {
        if (this.layer.values[prop] === undefined) {
          this.layer.values[prop] = this.layer.layout.values[prop];
        }
      }
      return this.layer.layout.templateFunc({ $markdown: marked, ...this.layer.values });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/utils/utilities.scss';

.fcc-layer {
  position: relative;
  border-bottom: 1px solid #bbb;
  .fcc-layer__preview {
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
}
</style>
