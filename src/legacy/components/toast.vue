<template>
  <transition name="toast">
    <div class="fcc-toast" v-show="isActive" :class="'fcc-' + type">
      <p class="fcc-toast__content">
        {{ message }}
      </p>
    </div>
  </transition>
</template>
<script>
  export default {
    name: 'toast',
    props: {
      message: {
        type: String,
        default () {
          return '';
        }
      },
      type: {
        type: String,
        default() {
          return 'default'
        }
      }
    },
    data () {
      return {
        isActive: false,
      }
    },
    watch: {
      message (value) {
        if (value) {
          this.isActive = true;
          setTimeout(() => {
            this.isActive = false;
            this.$emit('clear');
          }, 2000);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

@import '../assets/scss/utils/utilities';

  .fcc-success {
    border-top: 0.2rem solid #2D9E2E;
  }
  .fcc-error {
    border-top: 0.2rem solid #FFB100;
  }
  .fcc-toast {
    position: absolute;
    right: 0;
    left: 0;
    top: 2rem;
    margin: auto;
    display: flex;
    width: 32rem;
    max-width: calc(100% - 2rem);
    padding: 1rem;
    font-size: 1.2em;
    background: $secondary;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    box-shadow: 0 0 0.5rem #222;
    &__content {
      color: #ffffff;
      text-align: center;
    }
  }
  .toast-enter-active {
    transition: all .5s ease-out;
  }

  .toast-enter {
    transform: translateY(-10px);
    opacity: 0;
  }
</style>
