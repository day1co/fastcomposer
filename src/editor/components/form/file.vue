<template>
  <label class="composer-input-row composer-input-file">
    <div class="composer-input-title">{{ title }}</div>
    <div class="composer-input-group">
      <input
        type="text"
        :placeholder="placeholder"
        v-model="value" />
      <label class="composer-input-helper-file">
        {{ label }}
        <input
          type="file"
          style="display: none"
          @click="preclick"
          @change="selected" />
      </label>
    </div>
  </label>
</template>

<script>

// TODO add file upload functionality…???

export default {
  props: {
    title: String,
    modelValue: String,
    placeholder: String
  },
  data: () => ({
    files: null,
    uploading: false
  }),
  methods: {
    preclick(e) {
      if(e.target.files.length)
        e.target.files = null
    },
    selected(e) {
      this.files = e.target.files
    }
  },
  computed: {
    label() {
      return this.files === null? '파일 선택'
                     : uploading? '업로드 중'
                                : '선택 해제'
    },
    value: {
      get() { return this.modelValue },
      set(v) { this.$emit('update:modelValue', v) }
    }
  }
}

</script>

<style lang="sass">

.composer-input-file

  .composer-input-helper-file
    @include clickable
    flex-shrink: 0

    line-height: var(--input-line-height)
    padding: var(--input-padding-y) var(--input-padding-x)

    margin: 0
    box-shadow: $_1px * -1 0 0 var(--current-border)

</style>
