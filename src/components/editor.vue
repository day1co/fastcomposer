<template>
  <form class="fc-block__form">
    <fieldset
      v-for="param in layer.layout.params"
      :key="param.name"
      class="fc-block__form__fieldset"
    >
      <label class="fc-block__form__label" :for="layer.id + '--' + param.type">
        <strong class="fc-block__form__name">{{ param.name }}</strong>
        ({{ param.type }})
      </label>

      <template v-if="param.type === 'image'">
        <input
          type="url"
          :id="layer.id + '--' + param.type"
          :name="param.name"
          :placeholder="param.description"
          v-model="layer.values[param.name]"
        />
<!--        <preview-edit-->
<!--          :name="param.name"-->
<!--          accept="image/*"-->
<!--          @upload="upload"-->
<!--        ></preview-edit>-->
      </template>

      <template v-else>
        <input
          class="fc-block__form__input"
          :id="layer.id + '--' + param.type"
          :type="param.type"
          :name="param.name"
          :placeholder="param.description"
          v-model="layer.values[param.name]"
        />
      </template>
    </fieldset>
  </form>
</template>

<script>
  // import FileUpload from './file-upload.vue';

  export default {
    name: 'editor',
    components: {
      // FileUpload,
    },
    props: {
      layer: {
        type: Object,
        default(){
          return {}
        }
      },
    },
    methods: {
      upload(name, url) {
        this.layer.values[name] = url;
      },
    },
  };
</script>

<style lang="scss">
  @import '../assets/scss/utils/utilities.scss';
</style>
