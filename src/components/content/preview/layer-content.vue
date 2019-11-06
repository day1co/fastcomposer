<template>
  <div class="fc-layer">
    <div
      class="fc-layer__container"
      :id="layer.id"
      :class="['fc-layout-' + layer.layout.id, { 'fc-selected': isSelected }]"
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
    index: Number,
    isSelected: {
      type: Boolean
    }
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

.fc-layer {
  position: relative;
  .fc-selected {
    box-shadow: inset 0 0 0 .4rem red;
  }
  .fc-layer__preview {
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
