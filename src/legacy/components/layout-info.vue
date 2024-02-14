<template>
  <figure class="fcc-layout-info">
    <img class="fcc-layout-info__icon" :src="icon" :alt="layout.id" />
    <figcaption class="fcc-layout-info__label">
      <strong class="__item__group__name"> {{ layout.id }} </strong>
      <span v-if="index != null"> #{{ index }} </span>
      <br />
      {{ layout.meta.description }}
    </figcaption>
  </figure>
</template>

<script>

import { iconToUri } from '../../util/index.ts'

export default {
  props: {
    layout: {
      type: Object,
      default() { return {} },
      required: true
    },
    index: Number
  },
  computed: {
    icon() {
      return iconToUri(this.layout.meta.icon)
    }
  }
}

</script>

<style lang="scss">

@import '../assets/scss/utils/utilities';

.fcc-layout-info {
  display: flex;
  align-items: center;

  text-align: left;

  &__icon {
    width: $layer-icon-size;
    height: $layer-icon-size;

    margin-right: 0.6rem;

    .fcc-composer__simple-layers & {
      width: $layer-icon-size * 0.666;
      height: $layer-icon-size * 0.666;
    }
  }
  &.small &__icon {
    width: $layer-icon-size * 0.8;
    height: $layer-icon-size * 0.8;

    .fcc-composer__simple-layers & {
      width: $layer-icon-size * 0.5;
      height: $layer-icon-size * 0.5;
    }
  }

  &__label {
    line-height: 2.2rem;
    font-size: 1.6rem;

    white-space: nowrap;
    text-overflow: clip;
    overflow: hidden;

    > strong, > span {
      @include readable-font-features;
      font-variant-numeric: tabular-nums;
      font-size: 1.8rem;
    }
    > span {
      opacity: 0.5;
    }
    .fcc-composer__simple-layers & {
      display: flex;
      gap: 0.3em;

      br {
        display: none;
      }
    }
  }
  &.small &__label {
    line-height: 1.8rem;
    font-size: 1.4rem;

    > strong, > span {
      font-size: 1.6rem;
    }
  }
}
</style>
