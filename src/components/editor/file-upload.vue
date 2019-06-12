<template>
  <div class="fc-file-upload">
    <template v-if="state === 'READY'">
      <form enctype="multipart/form-data">
        <input type="file" :name="name" :accept="accept" @change="upload($event.target.files)" />
      </form>
    </template>
    <template v-if="state === 'UPLOADING'">
      <div>업로드 중...</div>
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
export default {
  props: {
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
    };
  },
  methods: {
    upload(files) {
      this.$root.$emit('fc-upload', { id: this.id, type: 'UPLOAD', files });
      //setTimeout(()=>this.$root.$emit('fc-upload', {id: this.id, type: 'STATE', state: 'UPLOADING', progress: 50}), 2*1000);
      //setTimeout(()=>this.$root.$emit('fc-upload', {id: this.id, type: 'STATE', state: 'ERROR', error: 'test'}), 5*1000);
      //setTimeout(()=>this.$root.$emit('fc-upload', {id: this.id, type: 'STATE', state: 'UPLOADED', url: 'test'}), 5*1000);
      if (!files.length)
        return;
      this.createImage(files[0]);
    },
    cancel() {
      this.$root.$emit('fc-upload', { id: this.id, type: 'CANCEL' });
      this.state = 'READY';
    },
    createImage(file) {
      const reader = new FileReader();
      const vm = this;

      reader.onload = (e) => {
        vm.layer.values[vm.name] = e.target.result;
      };
      reader.readAsDataURL(file);
    },
  },
  created() {
    this.$root.$on('fc-upload', event => {
      if (event.id === this.id) {
        console.log('fc-upload', event);
        if (event.type === 'STATE') {
          if (event.state === 'UPLOADED' && this.state !== 'UPLOADED') {
            this.$emit('upload', this.name, event.url);
          }
          this.state = event.state;
        }
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.fc-upload {
  display: flex;

  > div {
    flex: 1 1 0;
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
