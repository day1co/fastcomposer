<template>
  <header class="fc-composer__header">
    <h1 class="fc-composer__header__h">FastComposer</h1>
    <div class="fc-composer__header__utils">
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
        EventBus.$emit('toggleViewport', viewport);
      }
    }
  }
</script>
