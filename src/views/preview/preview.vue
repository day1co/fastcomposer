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
      <div :class="['fc-block', { 'fc-selected': blockIndex === currentLayerIndex }]"
           v-for="(block, blockIndex) in blocks"
           :key="'block-' + blockIndex"
           @click="select(blockIndex)">
        <div class="fc-block__info">
          <div>
            <b>{{ block.layout.id }}</b>
            <br />
            #{{ blockIndex }}
          </div>
        </div>
        <div
          class="fc-block__container"
          :id="block.id"
          :class="['fc-layout-' + block.layout.id, {'fc-hidden': block.hidden} ]"
          v-html="parserToHTML(block)"
        ></div>
      </div>
    </div>
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
      }
    },
    updated() {
      this.index = this.currentLayerIndex;
    }
  };
</script>

<style lang="scss" scoped>
  @use 'sass:math';
  @import '../../assets/scss/utils/utilities';

  $accent: #f00;
  $gutter-width: 3.2rem;

  .fc-preview {
    overflow: auto;
    background-color: $white;

    box-shadow: $gutter-width 0 0 $primary inset, -0.4rem 0 0 $primary inset;
  }

  .fc-block {
    position: relative;
    display: grid;
    grid-template-columns: $gutter-width auto;
    border-right: 0.4rem solid $primary;

    &.fc-selected {

      .fc-block__info {
        background: $accent;
        &::after {
          display: none;
        }
      }

      &::after {
        display: block;
        content: '';
        width: calc(100% - $gutter-width);
        height: 100%;
        position: absolute;
        top: 0;
        right: -0.4rem;
        bottom: 0;
        margin: auto;
        border: solid #f00;
        border-width: 0.4rem 0.4rem 0.4rem 0;
        z-index: 1;
        box-sizing: content-box;
        pointer-events: none;
      }
    }
    &__info {
      position: relative;
      background: $primary;
      color: white;
      font-size: 1.2rem;
      overflow: hidden;
      border-bottom: 0.1rem solid white;

      user-select: none;
      cursor: pointer;

      > div {
        position: absolute;
      }
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
