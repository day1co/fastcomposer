<template>
  <div class="fc-edit-input fc-edit-input--text">
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
    }
  }
}

</script>

<style lang="scss">

@import '../../assets/scss/utils/utilities';

.fc-edit-input > input[type="text"] {

}

</style>
