<template>
  <div class="fc-edit-list-wrap">

    <fieldset
      class="fc-edit-list-entry"
      v-for="(entry, index) in value"
      :key="index">
      <legend>
        <button class="fc-edit-list-remove" @click="removeItem(index)">
          <i class="material-icons"> close </i>
        </button>
        <b>{{ index + 1 }}</b>/{{ value.length }}
      </legend>

      <edit
        :layer="layer"
        :child="path.override({ index })" />

    </fieldset>

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

.fc-edit-row-label--list {
  position: sticky;
  top: 0.4rem;
  z-index: 10;
  background-color: $background;
  box-shadow: -0.4rem 0 0 0.4rem $background, 0.4rem 0 0 0.4rem $background;
}
.fc-edit-list {
  &-item {
    border-left: 0.4rem solid $primary;
    padding-left: 1.2rem;
    margin-bottom: 1.2rem;

    &:nth-child(2n + 1) {
      border-left-color: #8884;
    }
  }

  &-entry {
    border: 0.1rem solid $input-foreground-active;
    margin-top: 0.6rem;

    > legend {
      display: inline-block;
      font-style: inherit;

      line-height: 2rem;

      margin-left: -.8rem;
      padding: 0.2em 0.5em;

      background: #8884;
      font-variant-numeric: tabular-nums;
    }
    > .fc-edit {
      --__invalid_background_padding_x: 0.2rem;
      margin-top: -0.6rem;
      margin-bottom: 0.6rem;
      padding: 0 0.8rem;
    }
  }

  &-remove {
    margin: -.25rem 0 -.25rem -.7rem;
    padding: .2rem .4rem;
    vertical-align: top;
    background-color: transparent;
    transition: background-color 200ms ease;
    cursor: pointer;

    > i {
      font-size: 2rem;
      vertical-align: top;
    }

    &:hover {
      background-color: #8883;
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
    position: sticky;
    bottom: 0;
    width: 100%;
    height: 100%;
    margin-top: 1rem;
    padding: .5rem 0;
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
