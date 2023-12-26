<template>
  <div class="fcc-pane fcc-history">
    <header class="fcc-pane-title">
      <label class="fcc-pane-title-label">
        작업 내역 ← {{ past.length }} / {{ future.length }} →
      </label>
      <button
        class="fcc-pane-title-button"
        :disabled="!past.length"
        @click="state.undo()">
        <span class="material-icons">undo</span>
      </button>
      <button
        class="fcc-pane-title-button"
        :disabled="!future.length"
        @click="state.redo()">
        <span class="material-icons">redo</span>
      </button>
    </header>
    <ul class="fcc-pane-content fcc-history-list">
      <history-item
        :class="{
          past: true,
          current: state.past.length === (index + 1)
        }"
        v-for="(history, index) in past"
        :history="history"
        :key="history.id"
        @click.native="undoUntil(history.id)" />
      <history-item
        class="future"
        v-for="history in future"
        :history="history"
        :key="history.id"
        @click.native="redoUntil(history.id)" />
    </ul>
  </div>
</template>

<script>

import State from '../../../state'

import HistoryItem from './item.vue'

export default {
  components: {
    HistoryItem
  },
  props: {
    state: State
  },
  provide() {
    return {
      state: this.state
    }
  },
  methods: {
    // WARNING: undo/redo loop may run out of history stack if not found!!
    undoUntil(id) {
      while(this.past.length > 0 && this.past.at(-1).id !== id)
        this.state.undo()
    },
    redoUntil(id) {
      while(this.future.length > 0 && this.past.at(-1)?.id !== id)
        this.state.redo()
    }
  },
  computed: {
    past() {
      return this.state.past
    },
    future() {
      return this.state.future.slice().reverse()
    }
  },
  watch: {
    ['past.length']() {
      this.$el.querySelector('.current')?.scrollIntoView?.({ block: 'center' })
    }
  }
}

</script>

<style lang="scss">

@import '../../assets/scss/utils/utilities';

.fcc-history-list {
  > .fcc-history-item {
    margin: 0.4rem 0 0.4rem 0.4rem;
  }
}

</style>
