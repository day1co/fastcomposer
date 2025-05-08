<template>
  <figure class="fcc-layout-info">
    <img class="fcc-layout-info__icon" :src="icon" :alt="layout.id" />
    <figcaption class="fcc-layout-info__label">
      <strong class="fcc-layout-info__id"> {{ layout.id }} </strong>
      <span class="fcc-layout-info__index" v-if="index != null"> #{{ index }} </span>
      <br />
      <span
        v-if="!isEditing"
        @dblclick.stop="startEditing"
        :class="{
          'fcc-layout-info__label-text': true,
          'fcc-is-label': label
        }">{{ label || layout.meta.description }}</span>
      <input
        v-else
        :placeholder="layout.meta.description"
        v-model="editableText"
        @blur="save"
        @keyup.enter="save"
        ref="editInput"
        class="fcc-layout-info__label-input" />
    </figcaption>
  </figure>
</template>

<script>

import { iconToUri } from '../utils'

export default {
  props: {
    layout: {
      type: Object,
      default() { return {} },
      required: true
    },
    index: Number,
    label: String
  },
  data() {
    return {
      isEditing: false,
      editableText: ''
    }
  },
  computed: {
    icon() {
      return iconToUri(this.layout.meta.icon)
    },
    canEdit() {
      return this.label !== null && this.label !== undefined
    }
  },
  methods: {
    startEditing() {
      if(!this.canEdit)
        return
      this.editableText = this.label
      this.isEditing = true
      this.$nextTick(() => this.$refs.editInput.focus())
    },
    save() {
      if(this.isEditing) {
        this.isEditing = false
        this.$emit('update:label', this.editableText.trim())
      }
    }
  }
}

</script>

<style lang="scss">

@import '../assets/scss/utils/utilities';

.fcc-layout-info {
  display: flex;
  align-items: center;

  flex-grow: 1;

  margin: 0;

  text-align: left;

  &__icon {
    width: $layer-icon-size;
    height: $layer-icon-size;

    margin-right: 0.6rem;

    .fcc-composer__simple-layers & {
      width: $layer-icon-size * 0.666;
      height: $layer-icon-size * 0.666;
    }
  }
  &.small &__icon {
    width: $layer-icon-size * 0.8;
    height: $layer-icon-size * 0.8;

    .fcc-composer__simple-layers & {
      width: $layer-icon-size * 0.5;
      height: $layer-icon-size * 0.5;
    }
  }

  &__index {
    opacity: 0.5;
  }
  &__label {
    line-height: 2.2rem;
    font-size: 1.8rem;

    flex-grow: 1;

    white-space: nowrap;
    text-overflow: clip;
    overflow: hidden;

    > strong, > span {
      @include readable-font-features;
      font-variant-numeric: tabular-nums;
    }
    .fcc-composer__simple-layers & {
      display: flex;
      gap: 0.3em;

      br {
        display: none;
      }
    }

    &-input {
      @include readable-font-features;
      font: inherit;
      line-height: inherit;
      width: 100%;
      padding: 0;
      margin: 0;
      border: none;
      outline: none;
    }

    &-text {
      display: inline;
      font-size: 1.4rem;

      &.fcc-is-label {
        font-style: italic;
      }
    }
  }
  &.small &__label {
    line-height: 1.8rem;
    font-size: 1.4rem;

    .fcc-layout-info__id, .fcc-layout-info__index {
      font-size: 1.5rem;
    }
  }
}
</style>
