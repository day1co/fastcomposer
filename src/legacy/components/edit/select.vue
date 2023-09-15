<template>
  <div class="fc-edit-input fc-edit-input--select">
    <select
      v-model="value">
      <option
        v-for="(option, index) in param.options"
        :value="option">
        {{ option }}
      </option>
    </select>
    <!-- <label
      v-for="(option, index) in param.options"
      :key="index"
      :for="inputId + '-' + index"
      :class="[
        'fc-edit-input__selection',
        { 'fc-edit-input__selected': value === option }
      ]">
      <input
        type="radio"
        name="inputId"
        :value="option"
        :id="inputId + '-' + index"
        :placeholder="param.description"
        v-model="value" />
        {{ option }}
    </label> -->
  </div>
</template>

<script>

import mixin from './mixin.js'

export default {
  mixins: [ mixin ],
  data: () => ({
    shouldNotCompose: true
  })
}

</script>

<style lang="scss">

@import '../../assets/scss/utils/utilities';

.fc-edit-input {
  &--select {
    display: flex;
    flex-wrap: wrap;
  }
  &__selection {
    width: unset;
    flex-grow: 1;
    text-align: center;
    color: #fffc;

    > input {
      display: none;
    }
  }
  &__selected {
    box-shadow: 0 0 0 0.2rem inset;
    color: #ffff;
    background: #1a237e;

    &:hover {
      background: lighten(#1a237e, 10%);
    }
  }
}

</style>
