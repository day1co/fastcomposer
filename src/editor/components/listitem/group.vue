<template>
  <li :class="[
    'composer-list-group',
    localOpened? 'opened' : ''
  ]">
    <div class="composer-list-group-header composer-listitem" @click="toggle">
      <button class="composer-list-group-icon">
        <svg width="28" height="28" fill="none" stroke="currentColor">
          <path d="M8 11L14 17L20 11" />
        </svg>
      </button>
      <label>
        {{ title }}
      </label>
    </div>
    <ul class="composer-list-group-content" v-show="localOpened">
      <slot></slot>
    </ul>
  </li>
</template>

<script>

export default {
  props: {
    title: {
      type: String,
      default: '그룹 이름'
    },
    opened: Boolean
  },
  data: () => ({
    localOpened: false
  }),
  methods: {
    toggle() {
      this.localOpened = !this.localOpened
    }
  },
  created() {
    this.localOpened = this.opened
  }
}

</script>

<style lang="sass">

.composer-list-group

  &-icon
    box-shadow: inner-border-for(right, $color: var(--c-regional-hint))

  &-header
    @include clickable
    box-shadow: inner-border-for(bottom, $color: var(--c-regional-hint))

    label
      padding-left: 0

    > button

      > svg
        vertical-align: top

  &-content
    box-shadow: inner-border-for(left, $color: var(--c-regional-hint))
    margin-left: 1rem

</style>
