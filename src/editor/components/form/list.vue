<template>
  <ol class="composer-input-list" start="0">
    <li class="composer-input-title">
      <button
        class="composer-input-button composer-input-list-button"
        @click="addItem">
        <svg width="16" height="16" fill="none" stroke="currentColor">
          <path d="M4 8h8M8 4v8" />
        </svg>
      </button>
      <label> {{ param.name }} </label>
      <var> {{ value.length }}/{{ param.maxLength }} </var>
    </li>
    <li
      v-for="(item, index) in value"
      :key="index"
      class="composer-input-list-item">
      <button
        class="composer-input-list-button composer-input-button"
        @click="removeItem(index)">
        <svg width="16" height="16" fill="none" stroke="currentColor">
          <path d="M4 8h8" />
        </svg>
      </button>
      <composer-form
        :layer="layer"
        :path="path.override({ index })"
        :params="param.params">
      </composer-form>
    </li>
  </ol>
</template>

<script>

import { defineAsyncComponent } from 'vue'

export default {
  props: {
    layer: Object,
    path: Object,
    param: Object
  },
  components: {
    ComposerForm: defineAsyncComponent(() => import('./index.vue'))
  },
  methods: {
    addItem() {
      this.$composer.state.improvise('layer.item.new', this.path)
    },
    removeItem(index) {
      this.$composer.state.improvise(
        'layer.item.remove',
        this.path.override({ index })
      )
    },
  },
  computed: {
    value() {
      return this.layer.get(this.path.partial('child'))
    }
  }
}

</script>

<style lang="sass">

$indent-width: 1.125rem
$indent-padding: 0.125rem

.composer-input-list
  list-style: decimal

  > .composer-input-title
    display: flex
    align-items: center

    margin-bottom: 0

    > label
      flex-grow: 1
      margin-left: $indent-padding

    > var
      font: var(--font-ui-small)
      font-style: inherit

  &-button
    @include clickable

    width: $indent-width
    height: $indent-width

    vertical-align: top

  &-item
    position: relative
    margin-left: $indent-width + $indent-padding

  &-item > &-button
    position: absolute
    bottom: 0
    left: -$indent-width - $indent-padding

</style>
