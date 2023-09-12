<template>
  <div class="fc-editor">
    <layout-info :layout="layer.layout" />

    <edit :layer="layer" />
  </div>
</template>

<script>
import EventBus from '../../event-bus.vue';
import LayoutInfo from '../../components/layout-info.vue';
import Edit from '../../components/edit/index.vue'

export default {
  components: {
    LayoutInfo,
    Edit
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
        font-size: 1.4rem;
        margin-left: 0.4rem;
      }
      > .spacer {
        flex-grow: 10000;
      }
      .fc-tooltip-icon {
        align-self: center;
        margin-right: 0.2rem;
        opacity: 0.5;
      }
    }

    &__name {
      display: inline-block;
      font-size: 1.6rem;
    }

    &__textarea, &__text, &__select {
      @include readable-font-features;
      font-family: inherit;
      box-sizing: border-box;
      border: none;
      padding: 0 0 0 0.8rem;

      font-size: 1.5rem;
      line-height: 2.4rem;

      background-color: $input-background;
      color: $input-foreground;
      outline: 0 none;
      border: 0.1rem solid #555;

      transition: background-color 250ms ease, border-color 250ms ease;

      &:focus {
        background-color: $input-background-active;
        border-color: $input-foreground-active;
        color: $input-foreground-active;
      }

      &::placeholder {
        color: #888;
      }
      &::selection {
        background: $primary-active;
      }
    }

    &__textarea, &__text, &__select {
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

    &__text, &__select {
      height: 3.6rem;
    }

    &__select {
      padding: 0.8rem 0.4rem;
    }

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
        border-left-color: #8884;
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
      background-color: $primary-active;
      color: inherit;
      font: inherit;
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
