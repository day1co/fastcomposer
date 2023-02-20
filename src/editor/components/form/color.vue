<template>
  <label class="composer-input-row composer-input-color">
    <div class="composer-input-title">{{ title }}</div>
    <div class="composer-input-group">
      <label class="composer-input-group-caret">
        <input
          type="color"
          :maxlength="maxlength"
          :placeholder="placeholder"
          v-model="value" />
      </label>
      <input
        type="text"
        :maxlength="maxlength"
        :placeholder="placeholder"
        v-model="value" />
    </div>
  </label>
</template>

<script>

export default {
  props: {
    title: String,
    modelValue: null,
    maxlength: Number,
    placeholder: String
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

.composer-input-color

  input[type=color]
    flex-grow: 0
    flex-shrink: 0
    width: calc(var(--input-line-height) + var(--input-padding-y) * 2)

    margin: unset

    border: solid var(--current-border)
    border-width: 0 $_1px

    transition: var(--transition-button)

    cursor: pointer

    &, &::-webkit-color-swatch-wrapper
      padding: 0

    &::-webkit-color-swatch
      border: none !important

</style>
