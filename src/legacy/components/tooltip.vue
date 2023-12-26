<template>
  <div class="fcc-tooltip-icon" @mouseover="onOpen($event)" @mouseout="onClose($event)">
    <i class="material-icons fcc-tooltip-icon__content">info</i>
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
        const el = document.querySelector('.fcc-tooltip__content');
        const { style } = document.querySelector('.fcc-tooltip');

        el.innerHTML = this.message;
        style.display = 'block';
        style.top = `${y / 10}rem`;
        style.left = `${x / 10}rem`;
      },
      onClose() {
        const el = document.querySelector('.fcc-tooltip__content');
        const { style } = document.querySelector('.fcc-tooltip');

        el.innerHTML = '';
        style.display = 'none';
      }
    }
  };
</script>

<style lang="scss" scoped>
  .fcc-tooltip-icon {
    position: relative;
    display: inline-block;
    font-size: 0;
    vertical-align: middle;
    &__content {
      font-size: 2rem;
    }
  }
</style>
