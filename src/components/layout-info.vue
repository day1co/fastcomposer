<template>
  <figure class="fc-layout-info">
    <img class="fc-layout-info__icon" :src="icon" :alt="layout.id" />
    <figcaption class="fc-layout-info__label">
      <strong class="__item__group__name">{{ layout.id }}</strong>
      <br />
      {{ layout.description }}
    </figcaption>
  </figure>
</template>

<script>

export default {
  props: {
    layout: {
      type: Object,
      default() { return {} },
      required: true
    }
  },
  computed: {
    icon() {
      const icon = this.layout.icon
      if(!icon) {
        return
      } else if(/^<(?:\?xml |svg )/.test(icon)) {
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(icon)
      } else if(/^data:image\//.test(icon)) {
        return icon
      } else {
        return null
      }
    }
  }
}

</script>

<style lang="scss">

@import '../assets/scss/utils/utilities';

.fc-layout-info {
  display: flex;
  align-items: center;

  text-align: left;

  &__icon {
    width: $layer-icon-size;
    height: $layer-icon-size;

    margin-right: 0.8rem;
  }
  &.small &__icon {
    width: $layer-icon-size * 0.64;
    height: $layer-icon-size * 0.64;
  }

  &__label {
    line-height: 2rem;

    > strong {
      @include readable-font-features;
      font-size: 1.6rem;
    }
  }
  &.small &__label {
    line-height: 1.6rem;
    font-size: 1.2rem;

    > strong {
      font-size: 1.4rem;
    }
  }
}
</style>
