<template>
  <label class="composer-input-row composer-input-number">
    <div class="composer-input-title">{{ title }}</div>
    <div class="composer-input-group">
      <input
        type="number"
        :maxlength="maxlength"
        :placeholder="placeholder"
        pattern="^[+\-0-9\.]*$"
        @keypress="keypress"
        v-model="value" />
      <!-- implict <label> targets first input! -->
      <div class="composer-input-helper-button nud">
        <button
          tabindex="-1"
          class="up interactive"
          @click="up"></button>
        <button
          tabindex="-1"
          class="down interactive"
          @click="down"></button>
      </div>
    </div>
  </label>
</template>

<script>

export default {
  props: {
    title: String,
    modelValue: {
      type: [ Number, String ],
      default: 0
    },
    maxlength: Number,
    placeholder: String
  },
  methods: {
    sanitize() {
      if(typeof this.value === 'number')
        return
      if(Number.isNumber(this.value))
        return

      this.value = Number(this.value)
    },
    adjust(e, direction) {
      this.sanitize()

      const multiplier = (e.ctrlKey || e.metaKey) * 100 || e.shiftKey * 10 || 1
      const round = !e.altKey && (this.value % multiplier)

      if(direction > 0)
        this.value += round?
            multiplier * (this.value >= 0) - (this.value % multiplier)
          : multiplier
      else if(direction < 0)
        this.value -= round? multiplier + (this.value % multiplier) : multiplier
    },
    up(e) {
      this.adjust(e, 1)
    },
    down(e) {
      this.adjust(e, -1)
    },
    keypress(e) {
      switch(e.which) {
        case 38:
          e.preventDefault()
          return this.up(e)
        case 40:
          e.preventDefault()
          return this.down(e)
      }
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

<style lang="sass">

.composer-input-number
  .composer-input-group
    flex-direction: row-reverse // implict <label> targets first input!

</style>
