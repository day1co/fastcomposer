<template>
  <div class="fcc-preview" tabindex="-1">
    <div class="fcc-preview__container">
      <div
        v-for="(block, blockIndex) in blocks"
        :class="['fcc-block', {
          'fcc-selected': blockIndex === selected,
          'fcc-hidden': block.meta.hidden,
          'fcc-invalid': block.status.invalid.length
        }]"
        :key="'block-' + blockIndex"
        ref="layers"
        @click="select(blockIndex)">
        <div class="fcc-block__info">
          <div>
            <b>{{ block.layout.id }}</b>
            <br />
            #{{ blockIndex }}
          </div>
        </div>
        <div
          class="fcc-block__container"
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
        return block.render(null, true)
      },
      select(index) {
        const newIndex = Math.min(Math.max(index, 0), this.blocks.length - 1);
        this.$emit('selected', newIndex);
      },
      scroll(index) {
        this.$refs.layers?.[index]?.scrollIntoViewIfNeeded({ block: 'nearest' })
      }
    }
  };
</script>

<style lang="scss" scoped>
  @use 'sass:math';
  @import '../assets/scss/utils/utilities';

  $accent: #f00;
  $gutter-width: 3.2rem;

  .fcc-preview {
    // overflow: auto;
    background: #fff;

    box-shadow: $gutter-width 0 0 $gutter-default inset, -0.4rem 0 0 $gutter-default inset;
  }

  .fcc-block {
    position: relative;
    display: grid;
    grid-template-columns: $gutter-width auto;
    border-right: 0.4rem solid $gutter-default;

    &.fcc-selected {
      .fcc-block__info {
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
    &.fcc-hidden {
      .fcc-block__info {
        background: $gutter-disabled;
        b {
          text-decoration: line-through;
        }
      }
    }
    &.fcc-invalid .fcc-block__info {
      background: $gutter-invalid-default;
    }
    &.fcc-invalid.fcc-selected .fcc-block__info {
      background: $gutter-invalid-active;
    }
    &.fcc-invalid.fcc-selected::after {
      border-color: $invalid-active;
    }
    &__info {
      @include readable-font-features;
      position: relative;
      background-color: $gutter-default;
      color: white;
      font-size: 1.3rem;
      line-height: 1.8rem;
      // overflow: hidden;
      border-bottom: 0.1rem solid white;

      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" fill="white"><path d="M0 0H6V6z"/></svg>');
      background-size: .6rem;
      background-position: right top;
      background-repeat: no-repeat;

      user-select: none;
      cursor: pointer;

      > div {
        position: sticky;
        top: 0;
        height: 0;
      }
    }

    .fcc-block__preview {
      flex: 0 0 0;
      width: 100%;
      outline: 1px dashed lightgray;

      &.active {
        outline: 1px dashed fuchsia;
      }
    }
  }

  .fcc-block.fcc-hidden {

    .fcc-composer__hide-layer- & {
      .fcc-block__container {
        opacity: 0.5;
      }

      background-color: #fff;
    }
    .fcc-composer__hide-layer-hatched &,
    .fcc-composer__hide-layer-gutter-only & {
      .fcc-block__container {
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
    .fcc-composer__hide-layer-gutter-only &,
    .fcc-composer__hide-layer-hide & {
      .fcc-block__container {
        display: none;
      }
    }
    .fcc-composer__hide-layer-gutter-only & {
      .fcc-block__info {
        min-height: 1.5em;
      }
    }
  }
</style>
