<template>
  <figure class="composer-layout-info">
    <img v-if="icon" :src="icon" />
    <svg v-else width="40" height="40">
      <rect x="0.5" y="0.5" width="39" height="39" fill="none" stroke="red" stroke-opacity="0.25" />
      <circle cx="16" cy="16" r="10" fill="#ddd" />
      <rect x="18" y="18" width="16" height="16" fill="#aaa" />
    </svg>
    <figcaption>
      <strong> {{ layout?.id }} </strong>
      <br />
      <span> {{ layout?.meta?.description }} </span>
    </figcaption>
  </figure>
</template>

<script>

export default {
  props: {
    layout: Object
  },
  computed: {
    icon() {
      const icon = this.layout?.meta?.icon
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

<style lang="sass">

.composer-layout-info
  @include unselectable

  display: flex
  align-items: center

  // TODO refactor
  font-size: 0.8125rem

  > img, > svg
    width: 2.5rem
    height: 100%

    object-fit: contain

  figcaption
    flex-grow: 1

    line-height: 1rem
    padding: 0 0 0 0.5rem

</style>
