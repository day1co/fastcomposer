<template>
  <div class="fc-preview" tabindex="-1">
    <div class="fc-preview__container">
      <div
        v-for="(block, blockIndex) in blocks"
        :class="['fc-block', {
          'fc-selected': blockIndex === selected,
          'fc-hidden': block.meta.hidden
        }]"
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
          :class="'fc-layout-' + block.layout.id"
          v-html="parserToHTML(block)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
  import EventBus from '../event-bus.vue';
  import { parse as marked } from 'marked';
  import { template } from 'lodash';

  export default {
    props: {
      blocks: {
        type: Array,
        default() {
          return [];
        },
      },
      selected: {
        type: Number,
        default() {
          return -1
        }
      }
    },
    data() {
      return {
        index: this.selected
      }
    },
    methods: {
      parserToHTML(block) {
        return block.render()
      },
      select(index) {
        const newIndex = Math.min(Math.max(index, 0), this.blocks.length - 1);
        this.$emit('selected', newIndex);
      },
      scroll(index) {
        this.$refs.layers?.[index]?.scrollIntoView({ block: 'start' })
      }
    }
  };
</script>

<style lang="scss" scoped>
  @use 'sass:math';
  @import '../assets/scss/utils/utilities';

  $accent: #f00;
  $gutter-width: 3.2rem;

  .fc-preview {
    // overflow: auto;
    background: #fff;

    box-shadow: $gutter-width 0 0 $gutter-default inset, -0.4rem 0 0 $gutter-default inset;
  }

  .fc-block {
    position: relative;
    display: grid;
    grid-template-columns: $gutter-width auto;
    border-right: 0.4rem solid $gutter-default;

    &.fc-selected {
      .fc-block__info {
        background: $gutter-active;
        &::after {
          display: none;
        }
      }

      &::after {
        /* FIXME some layouts collide with this due to z-index */
        /* remove those OR somehow just solve it (by creating new stack context? idk) */
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
    &.fc-hidden {
      .fc-block__info {
        background: $gutter-disabled;
        b {
          text-decoration: line-through;
        }
      }
    }
    &__info {
      @include readable-font-features;
      background: $gutter-default;
      color: white;
      font-size: 1.3rem;
      line-height: 1.8rem;
      // overflow: hidden;
      border-bottom: 0.1rem solid white;

      user-select: none;
      cursor: pointer;

      > div {
        position: sticky;
        top: 0;
        height: 0;
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
  }

  .fc-block.fc-hidden {

    .fc-composer__hide-layer- & {
      .fc-block__container {
        opacity: 0.5;
      }

      background-color: #fff;
    }
    .fc-composer__hide-layer-hatched &,
    .fc-composer__hide-layer-gutter-only & {
      .fc-block__container {
        opacity: 0.5;
      }

      background-image: linear-gradient(-45deg,
        #888,
        #888 calc(25% - 0.707px),
        #666 calc(25% - 0.707px),
        #666 calc(25% + 0.707px),
        #888 calc(25% + 0.707px),
        #888 calc(75% - 0.707px),
        #666 calc(75% - 0.707px),
        #666 calc(75% + 0.707px),
        #888 calc(75% + 0.707px),
        #888
      );
      background-size: 1rem 1rem;
      background-repeat: repeat;
    }
    .fc-composer__hide-layer-gutter-only &,
    .fc-composer__hide-layer-hide & {
      .fc-block__container {
        display: none;
      }
    }
    .fc-composer__hide-layer-gutter-only & {
      .fc-block__info {
        min-height: 1.5em;
      }
    }
  }
</style>
