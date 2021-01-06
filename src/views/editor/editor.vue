<template>
  <div class="fc-editor">
    <form v-if="layer.layout" class="fc-editor__form" @submit.prevent="">
      <fieldset v-for="param in layer.layout.params" :key="param.name" class="fc-editor__form__fieldset">
        <label class="fc-editor__form__label" :for="layer.id + '--' + param.type">
          <strong class="fc-editor__form__name">{{ param.name }}</strong>
          <small>({{ param.type }})</small>
          <small v-if="param.isRequired" class="required">* 필수</small>
          <tooltip v-if="param.description" :message="param.description"> </tooltip>
        </label>

        <template v-if="param.type === 'image' || param.type === 'video'">
          <input
            :id="layer.id + '--' + param.type"
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
            :id="layer.id + '--' + param.type"
            v-model="layer.values[param.name]"
            class="fc-editor__form__input"
            :type="param.type"
            :name="param.name"
            :placeholder="param.description"
          />
        </template>

        <template v-else-if="param.type === 'textarea'">
          <textarea v-model="layer.values[param.name]" class="fc-editor__form__textarea" rows="20"></textarea>
        </template>

        <template v-else-if="param.type === 'select'">
          <select v-model="layer.values[param.name]" class="fc-editor__form__select">
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
                  제거
                </button>
              </div>

              <div v-for="(childParams, key) of param.params" :key="key">
                <label class="fc-editor__form__label" :for="`${param.name}'--'${childParams.name}--${index}`">
                  <strong class="fc-editor__form__name">{{ childParams.name }}</strong>
                  <small>({{ childParams.type }})</small>
                  <small v-if="childParams.isRequired" class="required">* 필수</small>
                  <tooltip v-if="childParams.description" :message="childParams.description"> </tooltip>
                </label>
                <template v-if="childParams.type === 'image' || childParams.type === 'video'">
                  <input
                    :id="param.name + '--' + childParams.name + '--' + index"
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
                    :id="param.name + '--' + childParams.name + '--' + index"
                    v-model="item[childParams.name]"
                    class="fc-editor__form__textarea"
                    rows="20"
                  ></textarea>
                </template>

                <template v-else-if="childParams.type === 'select'">
                  <select
                    :id="param.name + '--' + childParams.name + '--' + index"
                    v-model="item[childParams.name]"
                    class="fc-editor__form__select"
                  >
                    <option disabled value="">타입을 선택하세요</option>
                    <option v-for="(option, index) in childParams.options" :key="index">{{ option }}</option>
                  </select>
                </template>
                <template v-else>
                  <input
                    :id="param.name + '--' + childParams.name + '--' + index"
                    v-model="item[childParams.name]"
                    class="fc-editor__form__input"
                    :type="childParams.type"
                  />
                </template>
              </div>

              <br />
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
  watch: {
    layer(value) {
      if (value.values && value.layout) {
        const valuesOfLayout = value.layout.values;
        const valuesOfValue = value.values;

        for (let propOfLayout in valuesOfLayout) {
          if (!valuesOfValue.propOfLayout) {
            this.$set(valuesOfValue, propOfLayout, valuesOfLayout[propOfLayout]);
          }
        }
      }
    },
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
  &__list-item:nth-child(1n + 2) {
    border-top: 0.1rem solid #1976d2;
    padding-top: 1.5rem;
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
      outline: 0 none;
      @include transition(null, 0.2s);

      &:focus {
        background-color: $accent;
        color: $white;
      }
    }
  }
  &__list-tools {
    display: flex;
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
.required {
  color: #ff0000;
  font-weight: bold;
}
</style>
