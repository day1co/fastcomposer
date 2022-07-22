<template>
  <div class="fc-editor">
    <header class="fc-editor__current-layout">
      <img :src="layer.layout.icon" :alt="layer.layout.id" />
      <p class="__item__group__info">
        <strong class="__item__group__name">{{ layer.layout.id }}</strong>
        <br />
        {{ layer.layout.description }}
      </p>
	</header>
    <form v-if="layer.layout" class="fc-editor__form" @submit.prevent="">
      <fieldset v-for="param in layer.layout.params" :key="param.name" class="fc-editor__form__fieldset">
        <label class="fc-editor__form__label" :for="toInputId(param)">
          <strong class="fc-editor__form__name">{{ param.name }}</strong>
          <small>{{ param.type }}</small>
          <span class="spacer"></span>
          <mark v-if="param.isRequired" class="required">* 필수</mark>
          <tooltip v-if="param.description" :message="param.description"> </tooltip>
        </label>

        <template v-if="param.type === 'image' || param.type === 'video'">
          <input
            :id="toInputId(param)"
            v-model="layer.values[param.name]"
            class="fc-editor__form__input"
            type="url"
            :name="param.name"
            :placeholder="param.description"
          />
          <file-upload :name="param.name" :layer="layer" :accept="accept[param.type]" @upload="onUpload"></file-upload>
        </template>

        <template v-else-if="param.type === 'datetime-local'">
          <input
            :id="toInputId(param)"
            v-model="layer.values[param.name]"
            class="fc-editor__form__input"
            :type="param.type"
            :name="param.name"
            :placeholder="param.description"
          />
        </template>

        <template v-else-if="param.type === 'textarea'">
          <textarea
            :id="toInputId(param)"
            v-model="layer.values[param.name]"
            class="fc-editor__form__textarea"
            rows="20"></textarea>
        </template>

        <template v-else-if="param.type === 'select'">
          <select
            :id="toInputId(param)"
            v-model="layer.values[param.name]"
            class="fc-editor__form__select">
            <option v-for="(option, index) in param.options" :key="index">{{ option }}</option>
          </select>
        </template>

        <template v-else-if="param.type === 'list'">
          <div class="fc-editor__list">
            <div v-for="(item, index) in layer.values[param.name]" :key="index" class="fc-editor__list-item">
              <div class="fc-editor__list-tools">
                <span class="fc-editor__list-item-number">{{ index + 1 }} / {{ param.maxLength }}</span>
                <button
                  v-if="param.type === 'list'"
                  type="button"
                  class="fc-editor__remove-btn"
                  @click="onRemove(layer, param, index)"
                >
                  <i class="material-icons">clear</i>
                </button>
              </div>

              <div v-for="(childParams, key) of param.params" :key="key" class="fc-editor__form__fieldset">
                <label class="fc-editor__form__label" :for="toInputId(param, childParams, index)">
                  <strong class="fc-editor__form__name">{{ childParams.name }}</strong>
                  <small>{{ childParams.type }}</small>
                  <span class="spacer"></span>
                  <mark v-if="childParams.isRequired" class="required">* 필수</mark>
                  <tooltip v-if="childParams.description" :message="childParams.description"> </tooltip>
                </label>
                <template v-if="childParams.type === 'image' || childParams.type === 'video'">
                  <input
                    :id="toInputId(param, childParams, index)"
                    v-model="item[childParams.name]"
                    class="fc-editor__form__input"
                    type="url"
                  />
                  <file-upload
                    :name="param.name"
                    :params="childParams"
                    :layer="layer"
                    :accept="accept[childParams.type]"
                    :index="index"
                    @upload="onUpload"
                  ></file-upload>
                </template>
                <template v-else-if="childParams.type === 'textarea'">
                  <textarea
                    :id="toInputId(param, childParams, index)"
                    v-model="item[childParams.name]"
                    class="fc-editor__form__textarea"
                    rows="20"
                  ></textarea>
                </template>

                <template v-else-if="childParams.type === 'select'">
                  <select
                    :id="toInputId(param, childParams, index)"
                    v-model="item[childParams.name]"
                    class="fc-editor__form__select"
                  >
                    <option disabled value="">타입을 선택하세요</option>
                    <option v-for="(option, index) in childParams.options" :key="index">{{ option }}</option>
                  </select>
                </template>
                <template v-else>
                  <input
                    :id="toInputId(param, childParams, index)"
                    v-model="item[childParams.name]"
                    class="fc-editor__form__input"
                    :type="childParams.type"
                  />
                </template>
              </div>
            </div>

            <div class="fc-editor__add-btn">
              <button
                type="button"
                :disabled="layer.values[param.name].length >= param.maxLength"
                @click="onAdd(param, layer)"
              >
                <span>
                  + 콘텐츠 추가
                </span>
              </button>
            </div>
          </div>
        </template>

        <template v-else>
          <input
            :id="layer.id + '--' + param.type"
            v-model="layer.values[param.name]"
            class="fc-editor__form__input"
            :type="param.type"
            :name="param.name"
            :placeholder="param.description"
          />
        </template>
      </fieldset>
    </form>
  </div>
</template>

<script>
import EventBus from '../../event-bus/event-bus';
import FileUpload from './file-upload.vue';
import Tooltip from '../../components/tooltip/tooltip';

export default {
  components: {
    Tooltip,
    FileUpload,
  },
  props: {
    layer: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      accept: {
        image: 'image/*',
        video: 'video/mp4',
      },
    };
  },  
  mounted() {
    EventBus.$on('focus-editor', () => this.focus());
  },
  methods: {
    onRemove(layer, param, index) {
      layer.values[param.name].splice(index, 1);
    },
    onAdd(param, layer) {
      const { params, name } = param;
      const { values } = layer;
      const newItem = params.reduce((attr, currentValue) => {
        if (!attr[currentValue.name]) {
          attr[currentValue.name] = currentValue.defaultValue || '';
        }
        return attr;
      }, {});

      if (values[name]) {
        values[name] = [...values[name], newItem];
      }
    },
    onUpload(name, url) {
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
    toInputId(param, child, index) {
      let id = this.layer.id
      id += '--' + param.name
      id += '-' + param.type
      if(child && index >= 0) {
        id += '-n' + index
        id += '-' + child.type
      }
      return id
    }
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/scss/utils/utilities';
.fc-editor {
  position: relative;

  &__current-layout {
    display: flex;
    margin-bottom: 0.8rem;
    line-height: 2.4rem;

    strong {
      @include readable-font-features;
      font-size: 1.6rem;
    }
    > img {
      margin-right: 0.8rem;
    }
  }
  &__edit {
    /*display: none;*/
    position: relative;
    margin: 0 1.8rem 1.2rem;
  }

  &__form {

    &__fieldset {
      padding: 0.4rem 0;
    }

    &__label {
      @include readable-font-features;
      display: flex;
      font-size: 1.4rem;
      align-items: baseline;

      > small {
        font-size: 1.2rem;
        margin-left: 0.4rem;
      }
      > .spacer {
        flex-grow: 10000;
      }
      .fc-tooltip-icon {
        align-self: center;
        margin-right: 0.2rem;
        color: #fff6;
      }
    }

    &__name {
      display: inline-block;
      font-size: 1.6rem;
    }

    &__textarea, &__input, &__select {
      @include readable-font-features;
      box-sizing: border-box;
      display: block;
      border: none;
      padding-left: 0.8rem;
      width: 100%;

      font-size: 1.4rem;

      background-color: #080808;
      color: white;
      outline: 0 none;

      @include transition(background-color, 0.2s);

      &:focus {
        background-color: darken(#1a237e, 15%);
      }

      &::selection {
        background: white;
        color: black;
      }
    }

    &__textarea {
      resize: vertical;
      padding-top: 0.8rem;
    }

    &__input, &__select {
      height: 2.5em;
      line-height: 1.5em;
    }

    &__select {
      padding-right: 0.4rem;
      padding-left: 0.4rem;
    }

    .required {
      color: #f44;
      background: none;
      font-weight: bold;
      margin-right: 0.4rem;
    }
  }
  &__list {
    &-item {
      border-left: 0.4rem solid $primary;
      padding-left: 1.6rem;
      margin-bottom: 1.2rem;

      &:nth-child(2n + 1) {
        border-left-color: lighten($primary, 12%);
      }
    }
    &-tools {
      display: flex;
      margin-left: -0.8rem;
      line-height: 2.6rem;

      button {
        line-height: 1;
        color: inherit;
        > i {
          vertical-align: top;
        }
      }
    }
  }
  &__add-btn {
    display: flex;
    justify-content: center;
    button {
      width: 100%;
      height: 100%;
      padding: 1rem 0;
      background-color: #607d8b;
      border-radius: 0.6rem;
      color: #ffffff;
      &[disabled] {
        opacity: 0.6;
      }
    }
    span {
      font-weight: bold;
    }
  }
  &__remove-btn {
    margin-left: auto;
  }
}
</style>
