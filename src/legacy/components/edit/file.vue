<template>
  <div class="fc-edit-input fc-edit-input--file">
    <input
      type="text"
      :id="inputId"
      :placeholder="param.placeholder"
      v-model="mappedValue" />
    <file-upload
      :name="param.name"
      :layer="layer"
      :accept="accept[param.type]"
      @upload="value => { mappedValue = value }" />
  </div>
</template>

<script>

import FileUpload from './file-upload.vue';

import mixin from './mixin.js'

export default {
  mixins: [ mixin ],
  components: {
    FileUpload
  },
  data: () => ({
    accept: {
      image: 'image/*',
      video: 'video/mp4'
    }
  })
}

</script>

<style lang="scss">

@import '../../assets/scss/utils/utilities';

.fc-edit-input > input[type="text"] {

}

</style>
