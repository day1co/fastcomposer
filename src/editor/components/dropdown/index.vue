<template>
  <ul :class="[
    'composer-dropdown',
    'direction-' + direction,
    opened? 'opened' : ''
  ]">
    <slot></slot>
  </ul>
</template>

<script>

export default {
  props: {
    opened: Boolean,
    direction: {
      type: String,
      default: 'bottom'
    }
  }
}

</script>

<style lang="sass">

.composer-dropdown
  @include visual-box-float

  display: none
  align-content: stretch
  flex-direction: column
  width: 12.5rem

  position: absolute
  top: 0
  left: 0

  &.opened
    display: flex

  &.direction-, &.direction-bottom
    top: 100%

  &.direction-right
    left: 100%

  &:has(> li.enabled)

    .composer-navbar &
      transform: translateX(-$dropdown-horizontal-padding)

    > li > label
      padding-left: $dropdown-horizontal-padding * 2

  // composer-dropdown-item

  > li
    position: relative

    > label
      @include clickable
      display: flex

      padding: 0 $dropdown-horizontal-padding
      line-height: 2rem

    > label > kbd
      margin-left: auto

      font-family: inherit
      font-size: 0.8em

      opacity: 0.5
      cursor: inherit

    &.enabled, &:has(.composer-dropdown)
      background-image: linear-gradient(to right, red, red)
      background-size: 0.5rem 0.75rem
      background-repeat: no-repeat
      background-position-y: center

    &.enabled
      @include background-image-icon(16, 16, 'M5,9 l3,3 l4-8')
      background-position-x: 0.125rem

    &:has(.composer-dropdown)
      @include background-image-icon(16, 16, 'M8,5l4,4l-4,4')
      background-position-x: calc(100% - 0.25rem)

</style>
