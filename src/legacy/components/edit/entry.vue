<template>
  <div class="fc-edit-row">

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
      v-model="mappedValue" />

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
    }
  }
}

</script>

<style lang="scss">

@import '../../assets/scss/utils/utilities';

.fc-edit-row {

  > .label {
    @include readable-font-features;

    display: flex;
    align-items: baseline;
    font-size: 1.4rem;

    .name {
      font-size: 1.6rem;
    }
    .type {
      font-size: 1.2rem;
      margin-left: 0.4rem;
      margin-right: auto;
    }

    .fc-tooltip-icon {
      align-self: center;
      margin-right: 0.2rem;
      color: #fff6;
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
    @include transition(background-color, 0.2s);

    box-sizing: border-box;
    display: inline-block;
    border: none;
    padding-left: 0.8rem;
    width: 100%;

    font-size: 1.4rem;

    background-color: #080808;
    color: white;
    outline: 0 none;


    &:hover, &:focus {
      background-color: darken(#1a237e, 15%);
    }

    &::selection {
      background: white;
      color: black;
    }
  }

  > input, > select, &__selection {
    height: 2.5em;
    line-height: 2.5em;
  }

  > select, &__selection {
    padding-right: 0.8rem;
    padding-left: 0.8rem;
  }
}

</style>
