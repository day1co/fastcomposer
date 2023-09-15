<template>
  <div class="fc-edit-list-wrap">

    <div
      class="fc-edit-list-entry"
      v-for="(entry, index) in value"
      :key="index">
      <i>{{ index + 1 }}/{{ value.length }} ({{ param.maxLength }})</i>

      <edit
        :layer="layer"
        :child="path.override({ index })" />

    </div>

    <button
      class="fc-edit-list-new"
      @click="addItem"
      :disabled="value.length >= param.maxLength">
      새 항목 추가 ({{ value.length }}/{{ param.maxLength }})
    </button>

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
  methods: {
    addItem() { /* eslint-disable */
      this.state.act('layer.item.new', this.path)
    },
    removeItem(index) {
      this.state.act('layer.item.remove', this.path.override({ index }))
    },
  }
}

</script>

<style lang="scss">

@import '../../assets/scss/utils/utilities';

.fc-edit-list {
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

  &-new {
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
  &__remove-btn {
    margin-left: auto;
  }
}

</style>
