<template>
  <header class="fc-composer__header">
    <h1 class="fc-composer__header__h">FastComposer</h1>
    <div class="fc-composer__header__utils">
      <button type="button" class="fc-utils__btn" @click="changeViewport('flush')"><i class="material-icons"></i></button>
      <button type="button" class="fc-utils__btn" @click="changeViewport('landscape')"><i class="material-icons"></i></button>
      <button type="button" class="fc-utils__btn" @click="changeViewport('portrait')"><i class="material-icons"></i></button></div>
  </header>
</template>

<script>
  export default {
    name: 'composer-header',
    methods: {
      changeViewport(viewport) {
        this.$emit('toggleViewport', viewport);
      }
    }
  }
</script>
