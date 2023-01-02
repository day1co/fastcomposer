<template>
  <div class="fc-editor">
    <layout-info :layout="layer.layout" />
    <!-- TODO - rewrite with <edit> component -->
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

        <template v-else-if="param.type === 'text'">
          <textarea
            :id="toInputId(param)"
            v-model="layer.values[param.name]"
            class="fc-editor__form__textarea fc-editor__form__textarea--short"
            @focus="resizeTextarea"
            @input="resizeTextarea"
          ></textarea>
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
                <template v-else-if="childParams.type === 'text'">
                  <textarea
                    :id="toInputId(param, childParams, index)"
                    v-model="item[childParams.name]"
                    class="fc-editor__form__textarea fc-editor__form__textarea--short"
                    @focus="resizeTextarea"
                    @input="resizeTextarea"
                  ></textarea>
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
import LayoutInfo from '../../components/layout-info.vue';
import FileUpload from './file-upload.vue';
import Tooltip from '../../components/tooltip/tooltip';

export default {
  components: {
    LayoutInfo,
    FileUpload,
    Tooltip,
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
      if(child && index >= 0) {
        id += '-item' + index
        id += '-' + child.name
      }
      return id
    },
    resizeTextarea(event) {
      const { target } = event
      const { scrollHeight, clientHeight } = target
      if(scrollHeight > clientHeight) {
        target.style.height = (scrollHeight + 4) + 'px'
      }
    }
  },
};
</script>

<style lang="scss">
@import '../../assets/scss/utils/utilities';
.fc-editor {
  position: relative;

  > .fc-layout-info  {
    margin-bottom: 0.8rem;
  }
  &__edit {
    /*display: none;*/
    position: relative;
    margin: 0 1.8rem 1.2rem;
  }
  /* TODO will be refactored into separated components (all below this) */
  &__form {

    &__fieldset {
      padding: 0.4rem 0;
    }

    &__label {
      @include readable-font-features;
      display: flex;
      font-size: 1.4rem;
      align-items: baseline;

      user-select: none;

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
      border: none;
      padding: 0 0 0 0.8rem;

      font-size: 1.5rem;
      line-height: 2.4rem;

      background-color: #242424;
      color: #d0d0d0;
      outline: 0 none;
      border: 0.1rem solid #555;

      transition: background-color 250ms ease, border-color 250ms ease;

      &:focus {
        background-color: #404040;
        border-color: #eee;
        color: #eee;
      }

      &::placeholder {
        color: #666;
      }
      &::selection {
        background: white;
      }
    }

    &__textarea, &__input, &__select {
      display: block;
      width: 100%;
    }

    &__textarea {
      resize: vertical;
      padding-top: 0.4rem;
      min-height: 3.4rem;
      max-height: 32rem;

      &--short {
        height: 3.4rem;
      }
    }

    &__input, &__select {
      height: 3.6rem;
    }

    &__select {
      padding: 0.8rem 0.4rem;
    }

    input[type="file"] {
      color: #888;
      cursor: pointer;
      outline: none;

      &::file-selector-button {
        background-color: #8883;
        color: inherit;
        border: none;
        padding: 0.2rem 0.6rem;

        border: 0.1rem solid #555;

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

    .fc-file-upload {
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
      padding-left: 1.2rem;
      margin-bottom: 1.2rem;

      &:nth-child(2n + 1) {
        border-left-color: lighten($primary, 12%);
      }
    }
    &-tools {
      display: flex;
      margin-left: -0.6rem;
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
