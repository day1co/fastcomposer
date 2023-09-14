<template>
  <div class="fc-edit-input fc-edit-input--text">
    <input
      type="text"
      :id="inputId"
      :placeholder="param.placeholder"
      v-model="value" />
  </div>
</template>

<script>

import mixin from './mixin.js'

export default {
  mixins: [ mixin ]
}

</script>

<style lang="scss">

@import '../../assets/scss/utils/utilities';

.fc-edit-input > input[type="text"] {

}

</style>
