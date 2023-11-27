<template>
  <div :class="{
    'fc-edit-row': true,
    'fc-edit-row--invalid': invalid
  }">

    <label class="label" :for="inputId">
      <strong class="name">{{ param.label ?? param.name }}</strong>
      <small class="type">{{ param.type }}</small>

      <mark v-if="param.isRequired" class="required">*필수</mark>
      <tooltip v-if="param.description" :message="param.description" />
    </label>

    <component
      :is="currentComponent"
      :path="path"
      :param="param"
      :layer="layer" />

  </div>
</template>

<script>

import Tooltip from '../tooltip.vue'
import mixin from './mixin.js'

import FileInput from './file.vue'
import Textarea from './textarea.vue'
import Select from './select.vue'
import List from './list.vue'
import Text from './text.vue'

export default {
  name: 'edit-entry',
  mixins: [ mixin ],
  components: {
    Tooltip
  },
  computed: {
    /* eslint-disable no-fallthrough */
    currentComponent() {
      switch(this.param.type) {
        case 'image':
        case 'video':
          return FileInput
        case 'datetime-local':
          // return Datetime
          return Text
        case 'textarea':
          return Textarea
        case 'select':
          return Select
        case 'list':
          return List
        default:
          return Text
      }
    },
    invalid() {
      return this.layer?.meta?.invalid?.some?.(_ => _.isEqual(this.path))
    }
  }
}

</script>

<style lang="scss">

@import '../../assets/scss/utils/utilities';

.fc-edit-row {
  margin: 0.8rem 0;

  &--invalid {
    background: $invalid-active;
    box-shadow: -.4rem 0 0 0.4rem $invalid-active, .4rem 0 0 0.4rem $invalid-active;
  }

  > .label {
    @include readable-font-features;

    display: flex;
    align-items: bottom;
    font-size: 1.4rem;
    line-height: 2.4rem;

    .name {
      font-size: 1.6rem;
    }
    .type {
      font-size: 1.4rem;
      margin-left: 0.4rem;
      margin-right: auto;
    }

    .fc-tooltip-icon {
      align-self: center;
      margin-right: 0.2rem;
      opacity: 0.5;

      > i {
        vertical-align: top;
      }
    }
    .required {
      color: #f44;
      background: none;
      font-weight: bold;
      margin-right: 0.4rem;
    }
  }
}

.fc-edit-input {

  > input, > textarea, > select, &__selection {
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

  > input, > textarea, > select {
    width: 100%;
  }

  > input, > select, &__selection {
    height: 2.5em;
    line-height: 2.5em;
  }

  > select, &__selection {
    padding-right: 0.8rem;
    padding-left: 0.4rem;
  }

  > textarea {
    resize: vertical;
    padding-top: 0.4rem;

    min-height: 3.4rem;
    max-height: 32rem;

    &.short {
      height: 3.4rem;
    }
  }
}

</style>
