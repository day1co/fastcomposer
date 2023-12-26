<template>
  <div class="fcc-edit-input fcc-edit-input--textarea">
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
  data: () => ({
    shouldNotCompose: false
  }),
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

.fcc-edit-input > textarea {
   resize: vertical;
   padding-top: 0.8rem;
}

</style>
