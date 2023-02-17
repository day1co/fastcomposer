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
      <div class="composer-input-helper nud">
        <button
          tabindex="-1"
          class="up"
          @click="up"></button>
        <button
          tabindex="-1"
          class="down"
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

.composer-input-helper.nud
  display: flex
  flex-direction: column

  width: 1.25rem

  margin: 0 //$_1px solid transparent
  transition: var(--transition-button)

  box-shadow: $_1px 0 0 var(--current-border)

  > button
    @include clickable
    flex-grow: 1

    overscroll-behavior: none

    &.up
      @include background-image-icon(20, 16, 'M7 10l3-3l3 3')
    &.down
      @include background-image-icon(20, 16, 'M7 6l3 3l3-3')

</style>
