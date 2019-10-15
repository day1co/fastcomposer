<template>
  <transition name="message-toast">
    <div class="fc-message-toast" v-show="isActive">
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
          }, 1500);
        }
      }
    }
  }
</script>

<style lang="scss" scope>
  .fc-message-toast {
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
