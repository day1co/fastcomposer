<template>
  <label class="composer-input-row composer-input-select">
    <div class="composer-input-title">{{ title }}</div>
    <div class="composer-input-group">
      <select v-model="value">
        <option
          v-for="[key, value] of _options"
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
    options: [ Array, Map ]
  },
  computed: {
    value: {
      get() { return this.modelValue },
      set(v) { this.$emit('update:modelValue', v) }
    },
    _options() {
      if(Array.isArray(this.options)) {
        return new Map(this.options.map(_ => [ _, _ ]))
      } else {
        return this.options
      }
    }
  }
}

</script>
