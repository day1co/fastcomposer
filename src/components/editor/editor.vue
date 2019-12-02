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
            class="fc-editor__form__input"
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
            class="fc-editor__form__input"
            :type="param.type"
            :id="layer.id + '--' + param.type"
            :name="param.name"
            :placeholder="param.description"
            v-model="layer.values[param.name]"/>
        </template>

        <template v-else-if="param.type === 'textarea'">
          <textarea class="fc-editor__form__textarea" rows="20" v-model="layer.values[param.name]"></textarea>
        </template>

        <template v-else-if="param.type === 'select'">
          <select class="fc-editor__form__select" v-model="layer.values[param.name]">
            <option v-for="( option, index ) in param.options" :key="index">{{ option }}</option>
          </select>
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
  import EventBus from './../../event-bus/event-bus';
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
      focus() {
        // XXX: focus the first input element and select all text if possible
        this.$nextTick(() => {
          // XXX: reset editor pane scroll position to top
          this.$el.scrollTop = 0;
          this.$el.parentElement.scrollTop = 0;
          this.$el.focus();
          const el = this.$el.querySelector('input,textarea,select,button');
          console.log(el);
          if (el) {
            el.focus();
            if (typeof el.select === 'function') {
              el.select();
            }
          }
        });
      },
    },
    mounted() {
      EventBus.$on('focus-editor', () => this.focus());
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
        color: $black;

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

      &__textarea {
        width: 100%;
      }

      &__select {
        width: 100%;
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
