<template>
  <transition name="message-toast">
    <div class="fc-message-toast" v-show="isActive" :class="'fc-' + type">
      <p class="fc-message-toast__content">
        {{ message }}
      </p>
    </div>
  </transition>
</template>
<script>
  import EventBus from './../../event-bus/event-bus';
  export default {
    name: 'message-toast',
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
            EventBus.$emit('clear');
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
  .fc-message-toast {
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
  .message-toast-enter-active {
    transition: all .5s ease-out;
  }

  .message-toast-enter {
    transform: translateY(-10px);
    opacity: 0;
  }
</style>
