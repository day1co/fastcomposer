<template>
  <div
    :id="block.id"
    class="fc-block-preview fc-block fc-layout"
    :class="['fc-layout-' + block.layout.id, { active: active }, { hidden: this.block.hidden }]"
    v-html="html"
  ></div>
</template>

<script>
import marked from 'marked';
export default {
  name: 'block-preview',
  props: {
    block: Object,
    zoom: Number,
    active: Boolean,
  },
  computed: {
    html() {
      return this.block.layout.templateFunc({ $markdown: marked, ...this.block.values });
    },
  },
  watch: {
    active(value) {
      if (value) {
        this.$el.scrollIntoViewIfNeeded();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.fc-block-preview {
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
