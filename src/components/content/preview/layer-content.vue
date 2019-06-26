<template>
  <div class="fc-layer">
    <div
      class="fc-layer__container"
      :id="layer.id"
      :class="['fc-layout-' + layer.layout.id, { active: active }, { hidden: layer.hidden }]"
      v-html="html"
    ></div>
  </div>
</template>

<script>
import EventBus from './../../../event-bus/event-bus';
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
      return this.layer.layout.templateFunc({ $markdown: marked, ...this.layer.values });
    },
  },
  methods: {
    removeLayer(index) {
      EventBus.$emit('remove-layer',index);
    },
  }
};
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/utils/utilities.scss';

.fc-layer {
  position: relative;
  border-bottom: 1px solid #bbb;
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
