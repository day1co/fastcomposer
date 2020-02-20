<template>
  <div class="fc-tooltip-icon" @mouseover="onOpen($event)" @mouseout="onClose($event)">
    <i class="material-icons fc-tooltip-icon__content">info</i>
  </div>
</template>

<script>
  export default {
    name: 'tooltip',
    props: {
      message: {
        default() {
          return '';
        }
      }
    },
    data() {
      return {
      }
    },
    methods: {
      onOpen({ target }) {
        const { x, y } = target.getBoundingClientRect();
        const el = document.querySelector('.fc-tooltip__content');
        const { style } = document.querySelector('.fc-tooltip');

        el.innerHTML = this.message;
        style.display = 'block';
        style.top = `${y / 10}rem`;
        style.left = `${x / 10}rem`;
      },
      onClose() {
        const el = document.querySelector('.fc-tooltip__content');
        const { style } = document.querySelector('.fc-tooltip');

        el.innerHTML = '';
        style.display = 'none';
      }
    }
  };
</script>

<style lang="scss" scoped>
  .fc-tooltip-icon {
    position: relative;
    display: inline-block;
    font-size: 0;
    vertical-align: middle;
    &__content {
      font-size: 2rem;
    }
  }
</style>
