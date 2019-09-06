<template>
  <div class="fc-editor">
    <form class="fc-editor__form">
      <fieldset
        v-for="param in layer.layout.params"
        :key="param.name"
        class="fc-editor__form__fieldset"
      >
        <label class="fc-editor__form__label" :for="layer.id + '--' + param.type">
          <strong class="fc-editor__form__name">{{ param.name }}</strong>
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
          <file-upload
            :name="param.name"
            :layer="layer"
            accept="image/*"
            @upload="upload"
          ></file-upload>
        </template>

        <template v-else-if="param.type === 'datetime-local'">
          <input
            type="datetime-local"
            class="fc-editor__form__input"
            :id="layer.id + '--' + param.type"
            :name="param.name"
            :placeholder="param.description"
            v-model="layer.values[param.name]"/>
        </template>

        <template v-else>
          <input
            class="fc-editor__form__input"
            :id="layer.id + '--' + param.type"
            :type="param.type"
            :name="param.name"
            :placeholder="param.description"
            v-model="layer.values[param.name]"
          />
        </template>
      </fieldset>
    </form>
  </div>
</template>

<script>
  import FileUpload from './file-upload.vue';

  export default {
    components: {
      FileUpload,
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

<style lang="scss" scoped>
  @import '../../assets/scss/utils/utilities';
  .fc-editor {
    position: relative;

    &__edit {
      /*display: none;*/
      position: relative;
      margin: 0 1.8rem 1.2rem;
    }

    &__form {
      padding: 1.2rem 1.2rem;
      background-color: $dimmed;

      &__fieldset {
        padding: 1.8rem 1.8rem;
        border-radius: 0.5rem;
        background-color: $white;

        & + & {
          margin-top: 1rem;
        }
      }

      &__label {
        display: block;
        margin-bottom: 1rem;
        font-size: 1.2rem;
        border-bottom: 0.1rem solid $grey-l5;
      }

      &__name {
        display: inline-block;
        font-size: 1.4rem;
        text-transform: uppercase;
        margin-bottom: -0.1rem;
        border-bottom: 0.1rem solid $secondary;
      }

      &__input {
        box-sizing: border-box;
        display: block;
        border: 0 none;
        padding-left: 0.8rem;
        padding-right: 0.8rem;
        width: percentage(1);
        height: 4.2rem;
        font-size: 1.6rem;
        background-color: $blue-l2;
        border-radius: 0.5rem;
        color: $white;
        outline: 0 none;
        @include transition(null, 0.2s);

        &:focus {
          background-color: $accent;
          color: $white;
        }
      }
    }
  }
</style>
