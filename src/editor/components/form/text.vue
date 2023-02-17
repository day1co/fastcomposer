<template>
  <label class="composer-input-row composer-input-number">
    <div class="composer-input-title">{{ title }}</div>
    <div class="composer-input-group">
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
