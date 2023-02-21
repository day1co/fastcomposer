<template>
  <label class="composer-input-row composer-input-checkbox">
    <div class="composer-input-title">{{ title }}</div>
    <div class="composer-input-group">
      <input
        type="checkbox"
        v-model="value" />
    </div>
  </label>
</template>

<script>

export default {
  props: {
    title: String,
    modelValue: null
  },
  computed: {
    value: {
      get() { return this.modelValue },
      set(v) { this.$emit('update:modelValue', v) }
    }
  }
}

</script>

<style lang="sass">

.composer-input-checkbox

  > .composer-input-group.composer-input-group
    width: calc(var(--input-line-height) + var(--input-padding-y) * 2)
    height: calc(var(--input-line-height) + var(--input-padding-y) * 2)

    flex-grow: 0
    flex-basis: calc(var(--input-line-height) + var(--input-padding-y) * 2)
    margin-right: auto

    > input[type='checkbox']
      @include background-image-icon(20, 20, 'M4 10l5 5l7-11', 'fill="none" stroke="white" stroke-width="2"')

      margin: 0.125rem
      mix-blend-mode: difference // can't use css variable inside src

      opacity: 0.2

      &:checked
        opacity: 1

  &::after
    display: block
    content: ''

    flex-grow: 100

</style>
