<template>
  <div class="fcc-edit-input fcc-edit-input--text">
    <input
      :type="type"
      :id="inputId"
      :placeholder="param.placeholder"
      v-model="value" />
  </div>
</template>

<script>

import mixin from './mixin.js'

export default {
  mixins: [ mixin ],
  computed: {
    type() {
      if(this.param.type ==='checkbox')
        return 'checkbox'
      if(this.param.type ==='datetime-local')
        return 'datetime-local'

      return 'text'
    },
    shouldNotCompose() {
      if(this.type === 'checkbox') {
        return true
      }
    }
  }
}

</script>

<style lang="scss">

@import '../../assets/scss/utils/utilities';

.fcc-edit-input > input[type="text"] {

}

</style>
