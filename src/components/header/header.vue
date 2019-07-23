<template>
  <header class="fc-header">
    <h1 class="fc-header__h">FastComposer</h1>
    <div class="fc-header__utils">
      <button type="button" class="fc-utils__btn" @click="showLayerPanel"><i class="material-icons">add</i></button>
      <button type="button" class="fc-utils__btn" @click="toggleViewport('flush')"><i class="material-icons"></i></button>
      <button type="button" class="fc-utils__btn" @click="toggleViewport('landscape')"><i class="material-icons"></i></button>
      <button type="button" class="fc-utils__btn" @click="toggleViewport('portrait')"><i class="material-icons"></i></button></div>
  </header>
</template>

<script>
  import EventBus from '../../event-bus/event-bus';

  export default {
    methods: {
      toggleViewport(viewport) {
        EventBus.$emit('toggle-viewport', viewport);
      },
      showLayerPanel($event) {
        EventBus.$emit('show-layout-panel', $event);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import './../../assets/scss/style.scss';

  .fc-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 101;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 1.8rem;
    padding-right: 1.8rem;
    width: percentage(1);
    height: $header-size;
    &__h {
      font-size: 1.8rem;
      color: $white;
    }

    &__utils {
      display: flex;

      .fc-utils__btn {
        flex: 1;
        display: flex;
        margin-left: 0.8rem;
        color: $white;
        align-items: center;
      }
    }
  }
</style>
