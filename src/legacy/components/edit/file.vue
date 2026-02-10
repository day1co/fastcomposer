<template>
  <div class="fcc-edit-input fcc-edit-input--file">
    <input
      type="text"
      :id="inputId"
      :placeholder="param.placeholder"
      v-model="value" />
    <div class="fcc-edit-file">
      <template v-if="uploadState === 'READY'">
        <form enctype="multipart/form-data">
          <input type="file" :accept="accept[param.type] ?? '*'" @change="upload($event.target.files)" />
        </form>
      </template>
      <template v-if="uploadState === 'UPLOADING'">
        <div> 업로드 중 </div>
        <button type="button" @click="cancel">취소</button>
      </template>
      <template v-if="uploadState === 'ERROR'">
        <div> 업로드 실패 </div>
        <button type="button" @click="cancel">취소</button>
      </template>
      <template v-if="uploadState === 'UPLOADED'">
        <div> 업로드 완료 </div>
        <button type="button" @click="cancel">취소</button>
      </template>
      <div class="progress" v-if="uploadState !== 'READY'">
        <div class="progress-bar" :style="`width: ${ statePercent }%`"></div>
      </div>
    </div>
  </div>
</template>

<script>

import { uniqueId } from '../../utils'

import EventBus from '../../event-bus.vue'
import mixin from './mixin.js'

export default {
  mixins: [ mixin ],
  data: () => ({
    accept: {
      image: 'image/*',
      video: 'video/mp4, video/webm',
    },
    uploadState: 'READY',
    statePercent: 0,
    currentId: null,
    shouldNotCompose: false
  }),
  methods: {
    upload(files) {
      if(this.uploadState !== 'READY')
        return

      this.currentId = 'fc-upload-' + uniqueId()

      const [ { size, type } ] = files
      // video or image
      const limit = type.includes('video')? 5 : 0.5

      if(size / 1048576 > limit)
        alert(`${limit}MB 이하의 파일을 올려주세요`)

      if(files.length) {
        this.uploadState = 'UPLOADING'
        this.statePercent = 20
        EventBus.$emit('fc-upload', {
          id: this.currentId,
          type: 'UPLOAD',
          files
        }, res => {
          this.value = res.url
          this.uploadState = 'UPLOADED'
          this.statePercent = 100
        })
      }
    },
    cancel() {
      EventBus.$emit('fc-upload', { id: this.currentId, type: 'CANCEL' })
      this.uploadState = 'READY'
      this.statePercent = 0
    }
  },
  computed: {
    id() {
      return `fc-upload-${this._uploadSeq++}-${uniqueId()}`
    }
  }
}

</script>

<style lang="scss">

@import '../../assets/scss/utils/utilities';

.fcc-edit-input {

  input[type="file"] {
    color: $input-foreground;
    cursor: pointer;
    outline: none;
    width: 100%;

    &::file-selector-button {
      background-color: $input-background;
      color: inherit;
      border: none;
      padding: 0.2rem 0.6rem;

      border: 0.1rem solid $input-foreground;

      cursor: pointer;
      transition: background-color 250ms ease, border-color 250ms ease;

      &:hover {
        background-color: #8884;
      }
      &:active {
        background-color: #8885;
      }
      &:active, &:focus {
        border-color: #eee;
      }
    }
    &:focus::file-selector-button {
      background-color: #8885;
      border-color: #eee;
    }
  }

  ::-webkit-inner-spin-button {
    margin-right: 0.4rem;
  }

  .fcc-edit-file {
    display: flex;
    flex-wrap: wrap;
    color: inherit;
    margin-top: 0.4rem;

    button {
      margin-left: auto;
      color: inherit;
    }

    .progress {
      width: 100%;
      height: 0.4rem;
      margin: 0.4rem 0 0 0;
      background: $primary;
      border-radius: 0;

      &-bar {
        height: 100%;
        background: #fff;
      }
    }
  }
}

</style>
