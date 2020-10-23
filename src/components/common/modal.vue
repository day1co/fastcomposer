<template>
  <div class="fc-modal-container" v-if="visible">
    <main>
      <div class="fc-modal-content fc-modal-container__content">
        <button>닫기</button>
        <slot name="main">
          default...
        </slot>
      </div>
    </main>
    <footer>

    </footer>
  </div>

</template>
<script>
  export default {
    data() {
      return {
        isDisplay: false
      }
    },
    methods: {

    }
  }
</script>
<style lang="scss">
  .fc-modal-container {
    display: flex;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    justify-content: center;
    align-items: center;

  &__content {
    padding: 3rem;
    background-color: #ffffff;
    font-size: 2rem;
    min-width: 45rem;
   }
  }
</style>
