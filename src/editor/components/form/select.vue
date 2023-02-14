<template>
  <label class="composer-input-row composer-input-select">
    <div class="composer-input-row-title">{{ title }}</div>
    <div class="composer-input-group">
      <select v-model="value">
        <option
          v-for="[key, value] of options"
          :key="key"
          :value="key">{{ value }}</option>
      </select>
    </div>
  </label>
</template>

<script>

export default {
  props: {
    title: {
      type: String,
      default: '문자열 속성'
    },
    modelValue: null,
    options: {
      type: Map,
      default: () => new Map([ ['a', 1], ['b', 2] ])
    }
  },
  computed: {
    value: {
      get() { return this.modelValue },
      set(v) { this.$emit('update:modelValue', v) }
    }
  }
}

</script>
