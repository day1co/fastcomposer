<template>
  <div class="fc-preview"
       tabindex="0"
       @keydown.exact.enter.prevent="focusEditor"
       @keydown.exact.up.prevent="select(index-1)"
       @keydown.exact.down.prevent="select(index+1)"
       @keydown.exact.home.prevent="select(0)"
       @keydown.exact.end.prevent="select(blocks.length - 1)"
       @keydown.exact.page-up.prevent="select(index - 5)"
       @keydown.exact.page-down.prevent="select(index + 5)"
  >
    <div class="fc-preview__container">
      <div class="fc-block" v-for="(block, blockIndex) in blocks" :key="'block-' + blockIndex">
        <div
          class="fc-block__container"
          :id="block.id"
          :class="['fc-layout-' + block.layout.id, { 'fc-selected': blockIndex === currentLayerIndex }, {'fc-hidden': block.hidden} ]"
          v-html="parserToHTML(block)"
          @click="select(blockIndex)"
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
      blocks: {
        type: Array,
        default() {
          return [];
        },
      },
      currentLayerIndex: {
        type: Number,
        default() {
          return -1
        }
      }
    },
    data() {
      return {
        index: this.currentLayerIndex
      }
    },
    methods: {
      parserToHTML(block) {
        const values = { $markdown: marked };
        if (block.layout.params) {
          for(const { name } of block.layout.params) {
            const value = block.values[name];
            values[name] = (value === undefined) ? block.layout.values[name] : values[name] = block.values[name];
          }
        }
        return block.layout.templateFunc(values);
      },
      select(index) {
        const newIndex = Math.min(Math.max(index, 0), this.blocks.length - 1);
        this.$emit('update:currentLayerIndex', newIndex);
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
    updated() {
      this.index = this.currentLayerIndex;
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
