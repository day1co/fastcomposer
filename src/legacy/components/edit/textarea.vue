<template>
  <div class="fc-edit-input fc-edit-input--textarea">
    <textarea
      rows="5"
      :id="inputId"
      :placeholder="param.placeholder"
      v-model="value"
      @focus="resizeTextarea"
      @input="resizeTextarea"></textarea>
  </div>
</template>

<script>

import mixin from './mixin.js'

export default {
  mixins: [ mixin ],
  methods: {
    resizeTextarea(event) {
      const { target } = event
      const { scrollHeight, clientHeight } = target
      if(scrollHeight > clientHeight) {
        target.style.height = (scrollHeight + 4) + 'px'
      }
    }
  }
}

</script>

<style lang="scss">

@import '../../assets/scss/utils/utilities';

.fc-edit-input > textarea {
   resize: vertical;
   padding-top: 0.8rem;
}

</style>
