<template>
  <li :class="[
    'composer-listitem composer-listitem-history',
    { future }
  ]">
    <span class="composer-listitem-icon">
      <svg width="24" height="24">
        <rect x="0.5" y="0.5" width="23" height="23" fill="none" stroke="red" stroke-width="1" />
      </svg>
    </span>
    <label>
      {{ act.action }}
      ({{ act.arg }})
    </label>
    <slot></slot>
  </li>
</template>

<script>

export default {
  props: {
    act: Object,
    future: Boolean
  }
}

</script>

<style lang="sass">

.composer-listitem-history
  line-height: 1.5rem

  &.future, &[future]
    opacity: 0.5

</style>
