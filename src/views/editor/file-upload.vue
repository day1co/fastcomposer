<template>
  <div class="fc-file-upload">
    <div class="progress">
      <div class="progress-bar" :style="`width: ${ statePercent }%`"></div>
    </div>
    <template v-if="state === 'READY'">
      <form enctype="multipart/form-data">
        <input type="file" :name="name" :accept="accept" @change="upload($event.target.files)" />
      </form>
    </template>
    <template v-if="state === 'UPLOADING'">
      <div>업로드 중</div>
      <button type="button" @click="cancel">취소</button>
    </template>
    <template v-if="state === 'ERROR'">
      <div>업로드 실패</div>
      <button type="button" @click="cancel">취소</button>
    </template>
    <template v-if="state === 'UPLOADED'">
      <div>업로드 완료</div>
      <button type="button" @click="cancel">취소</button>
    </template>
  </div>
</template>

<script>
import EventBus from '../../event-bus/event-bus';

export default {
  props: {
    index: Number,
    params: {
      type: Object,
      default() {
        return {}
      }
    },
    name: String,
    accept: String,
    layer: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      id() {
        // each upload component has unique identifier
        const seq = (this._uploadSeq = this._uploadSeq ? ++this._uploadSeq : 1);
        const nonce = Math.random()
          .toString(36)
          .substr(2, 9);
        return `fc-upload-${seq}-${nonce}`;
      },
      state: 'READY',
      statePercent: 0,
      DEFAULT_SIZE: 1024 * 1024, // 1MB
    };
  },
  methods: {
    upload(files) {
      // this.$root.$emit('fc-upload', { id: this.id, type: 'UPLOAD', files });
      //setTimeout(()=>this.$root.$emit('fc-upload', {id: this.id, type: 'STATE', state: 'UPLOADING', progress: 50}), 2*1000);
      //setTimeout(()=>this.$root.$emit('fc-upload', {id: this.id, type: 'STATE', state: 'ERROR', error: 'test'}), 5*1000);
      //setTimeout(()=>this.$root.$emit('fc-upload', {id: this.id, type: 'STATE', state: 'UPLOADED', url: 'test'}), 5*1000);
      // if (!files.length)
      //   return;
      const [ { size, type } ] = files;
      // video or image
      const LIMITED_SIZE = type.includes('video') ? this.DEFAULT_SIZE * 5 : this.DEFAULT_SIZE * 1 / 2;

      if (size > LIMITED_SIZE) {
        alert(`${ LIMITED_SIZE / this.DEFAULT_SIZE }Mb 이하의 파일을 올려주세요`);
      }

      if (files.length) {
        this.state = 'UPLOADING';
        this.statePercent = 50;
        EventBus.$emit('fc-upload', { id: this.id, type: 'UPLOAD', files }, (res) => {
          if (this.index >= 0) {
            this.layer.values[this.name][this.index][this.params.name] = res.url;
          } else {
            this.layer.values[this.name] = res.url;
          }
          this.state = 'UPLOADED';
          this.statePercent = 100;
        });
      }
    },
    cancel() {
      this.$root.$emit('fc-upload', { id: this.id, type: 'CANCEL' });
      this.state = 'READY';
      this.statePercent = 0;
    },
  },
  created() {
    // EventBus.$on('fc-upload', event => {
    //   if (event.id === this.id) {
    //     console.log('fc-upload', event);
    //     if (event.type === 'STATE') {
    //       if (event.state === 'UPLOADED' && this.state !== 'UPLOADED') {
    //         this.$emit('upload', this.name, event.url);
    //       }
    //       this.state = event.state;
    //     }
    //   }
    // });
  },
};
</script>

<style lang="scss" scoped>
.fc-upload {
  display: flex;

  > div {
    flex: 1 1 0;
  }

  .progress {
    width: 100%;
    height:2px;
    background-color: grey;
    border-radius: 6px;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25), 0 1px rgba(255, 255, 255, 0.08);
    .progress-bar {
      height: 100%;
      border-radius: 4px;
      background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05));
      transition: 0.4s linear;
      transition-property: width, background-color;
      box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.25), inset 0 1px rgba(255, 255, 255, 0.1);
    }
  }

  button {
    flex: 0 0 5rem;
    width: 5rem;
  }

  form {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;

    input[type='file'] {
      width: 100%;
    }
  }
}
</style>
