<template>
  <ol class="composer-input-list">
    <li class="composer-input-title">
      <button
        class="composer-input-button composer-input-list-button"
        @click="addItem"
        :disabled="!spaceLeft">
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
      if(this.spaceLeft)
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
    },
    spaceLeft() {
      return this.value.length < this.param.maxLength
    }
  }
}

</script>

<style lang="sass">

$indent-width: 1.125rem
$indent-padding: 0.25rem

.composer-input-list
  counter-reset: index

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

    &:disabled
      cursor: not-allowed
      pointer-events: none

      > svg
        opacity: 0.25


  &-item
    position: relative
    padding-left: $indent-width + $indent-padding

    counter-increment: index

    background-image: single-color-image(var(--c-fg-hint))
    background-size: 0.125rem calc(100% - $indent-width * 2 - 0.5rem)
    background-position: ($indent-width - 0.125rem) * 0.5 $indent-width + 0.25rem
    background-repeat: no-repeat

    &::before
      display: inline-block
      content: counter(index)

      position: absolute
      top: 0
      left: 0

      width: $indent-width
      text-align: center

  &-item > &-button
    position: absolute
    bottom: 0
    left: 0

.composer-pane-wide

  .composer-input-list-item
    padding-top: $indent-width
    padding-left: 0

    background-image: single-color-image(var(--c-regional-hint))
    background-size: calc(100% - $indent-width * 2 - 0.875rem) $_1px
    background-position: right ($indent-width - 0.125rem) * 0.5

    &::before
      content: '#' counter(index)
      width: unset
      left: $indent-width + $indent-padding

      text-align: left
      line-height: $indent-width

    > .composer-input-list-button
      top: 0
      bottom: unset

    .composer-input-title
      text-indent: $indent-padding

</style>
