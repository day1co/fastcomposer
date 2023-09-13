<template>
  <div class="fc-edit-input fc-edit-input--file">
    <input
      type="text"
      :id="inputId"
      :placeholder="param.placeholder"
      v-model="mappedValue" />
    <div class="fc-edit-file">
      <template v-if="state === 'READY'">
        <form enctype="multipart/form-data">
          <input type="file" :name="name" :accept="accept" @change="upload($event.target.files)" />
        </form>
      </template>
      <template v-if="state === 'UPLOADING'">
        <div> 업로드 중 </div>
        <button type="button" @click="cancel">취소</button>
      </template>
      <template v-if="state === 'ERROR'">
        <div> 업로드 실패 </div>
        <button type="button" @click="cancel">취소</button>
      </template>
      <template v-if="state === 'UPLOADED'">
        <div> 업로드 완료 </div>
        <button type="button" @click="cancel">취소</button>
      </template>
      <div class="progress" v-if="state !== 'READY'">
        <div class="progress-bar" :style="`width: ${ statePercent }%`"></div>
      </div>
    </div>
  </div>
</template>

<script>

import { uniqueId } from '../../../util'

import mixin from './mixin.js'

export default {
  mixins: [ mixin ],
  data: () => ({
    accept: {
      image: 'image/*',
      video: 'video/mp4'
    },
    state: 'READY',
    statePercent: 0,
    currentId: null
  }),
  methods: {
    upload(files) {
      if(this.state !== 'READY')
        return

      this.currentId = 'fc-upload-' + uniqueId()

      const [ { size, type } ] = files
      // video or image
      const limit = type.includes('video')? 5 : 0.5

      if(size / 1048576 > limit)
        alert(`${limit}MB 이하의 파일을 올려주세요`)

      if(files.length) {
        this.state = 'UPLOADING'
        this.statePercent = 20
        EventBus.$emit('fc-upload', {
          id: this.currentId,
          type: 'UPLOAD',
          files
        }, res => {
          this.mappedValue = res.url
          this.state = 'UPLOADED'
          this.statePercent = 100
        })
      }
    },
    cancel() {
      this.$root.$emit('fc-upload', { id: this.currentId, type: 'CANCEL' })
      this.state = 'READY'
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

.fc-edit-input {

  input[type="file"] {
    color: $input-foreground;
    cursor: pointer;
    outline: none;

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

  .fc-edit-file {
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
