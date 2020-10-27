<template>
  <transition name="toast">
    <div class="fc-toast" v-show="isActive" :class="'fc-' + type">
      <p class="fc-toast__content">
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
  .fc-success {
    background: #2D9E2E;
  }
  .fc-error {
    background: #FFB100;
  }
  .fc-toast {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 8rem;
    justify-content: center;
    align-items: center;
    z-index: 1000;
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
