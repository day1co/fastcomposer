<template>
  <div class="fc-preview"
       tabindex="0"
       @keydown.exact.enter.prevent="focusEditor"
       @keydown.exact.up.prevent="select(index-1)"
       @keydown.exact.down.prevent="select(index+1)"
       @keydown.exact.home.prevent="select(0)"
       @keydown.exact.end.prevent="select(layers.length - 1)"
       @keydown.exact.page-up.prevent="select(index - 5)"
       @keydown.exact.page-down.prevent="select(index + 5)"
  >
    <div class="fc-preview__container">
      <div class="fc-block" v-for="(layer, layerIndex) in layers" :key="'layer-' + layerIndex">
        <div
          class="fc-block__container"
          :id="layer.id"
          :class="['fc-layout-' + layer.layout.id, { 'fc-selected': layerIndex === index }, {'fc-hidden': layer.hidden} ]"
          v-html="parserToHTML(layer)"
          @click="select(layerIndex)"
        ></div>
      </div>
    </div>
    <button class="fc-preview__save" type="button" @click="save">
      <i class="material-icons">&#xE5CA;</i>
    </button>
  </div>
</template>

<script>
  import EventBus from '../../event-bus/event-bus';
  import marked from 'marked';

  export default {
    props: {
      layers: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    data() {
      return {
        index: null
      }
    },
    methods: {
      parserToHTML(layer) {
        const values = { $markdown: marked };
        if (layer.layout.params) {
          for(const { name } of layer.layout.params) {
            const value = layer.values[name];
            values[name] = (value === undefined) ? layer.layout.values[name] : values[name] = layer.values[name];
          }
        }
        return layer.layout.templateFunc(values);
      },
      select(index) {
        const newIndex = Math.min(Math.max(index, 0), this.layers.length - 1);
        this.$emit('selected-layer', newIndex);
        this.$emit('move-selected-layer');
      },
      focus() {
        this.$el.focus();
      },
      focusEditor() {
        EventBus.$emit('focus-editor');
      },
      save() {
        EventBus.$emit('save');
      }
    },
    mounted() {
      this.$on('selected-layer', (index) => {
        this.index = index;
      });
      EventBus.$on('remove-layer', () => {
        this.index = null;
      })
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/utils/utilities';
  .fc-preview {
    background-color: $white;

    &__save {
      position: fixed;
      right: 1.75rem;
      top: 2.5rem;
      z-index: 102;
      width: 4.5rem;
      height: 4.5rem;
      background-color: $accent;
      border-radius: percentage(1/2);
      color: $white;
      box-shadow: 0 .3rem 1rem rgba($black, 0.24), 0 .3rem 1rem rgba($black,
        0.16);
      @include transition(null, 0.3s);

      .fc-composer--aside-r & {
        right: $sidebar-size + 1.75rem;
      }
    }
  }
  .fc-block {
    position: relative;
    .fc-selected {
      box-shadow: inset 0 0 0 .4rem red;
      padding: .4rem;
    }
    .fc-block__preview {
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
