<template>
  <div class="fc-layer">
    <div
      class="fc-layer__container"
      :id="layer.id"
      :class="['fc-layout-' + layer.layout.id, { 'fc-selected': isSelected }, {'fc-hidden': layer.hidden} ]"
      v-html="html"
      @click="select"
    ></div>
  </div>
</template>

<script>
import marked from 'marked';
import EventBus from '../../../event-bus/event-bus';

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
      const values = { $markdown: marked };
      if (this.layer.layout.params) {
        for(const { name } of this.layer.layout.params) {
          const value = this.layer.values[name];
          values[name] = (value === undefined) ? this.layer.layout.values[name] : values[name] = this.layer.values[name];
        }
      }
      return this.layer.layout.templateFunc(values);
    },
  },
  methods: {
    select() {
      EventBus.$emit('selected-layer', this.index);
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
    padding: .4rem;
  }
  .fc-layer__preview {
    flex: 0 0 0;
    width: 100%;
    outline: 1px dashed lightgray;

    &.active {
      outline: 1px dashed fuchsia;
    }
  }
  .fc-hidden {
    opacity: 0.5;
    background-color: olive;
  }
}
</style>
