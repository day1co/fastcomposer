<template>
  <div class="fc-edit-list-wrap">

    <div
      class="fc-edit-list-entry"
      v-for="(entry, index) in value"
      :key="index">
      <i>{{ index + 1 }}/{{ value.length }} ({{ param.maxLength }})</i>

      <edit
        :path="path.override({ index })"
        :params="param.params"
        :value="value[index]"
        @input="value => update(index, value)" />

    </div>

    <button
      @click="addItem"
      :disabled="value.length >= param.maxLength">+</button>

  </div>
</template>

<script>

import mixin from './mixin.js'

export default {
  name: 'edit-list',
  mixins: [ mixin ],
  components: {
    Edit: () => import('./index.vue')
  },
  props: {
    value: {
      type: Array,
      default() { return [] }
    }
  },
  methods: {
    addItem() { /* eslint-disable */
      const { params, name } = this.param
      const newItem = Object.fromEntries(params.map(param => [ param.name, param.defaultValue ?? '' ]))
      this.mappedValue.push(newItem)
    },
    removeItem(index) {

    },
    update(index, value) {
      this.$set(this.mappedValue, index, value)
    }
  }
}

</script>

<style lang="scss">

@import '../../assets/scss/utils/utilities';

</style>
