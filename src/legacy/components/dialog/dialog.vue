<template>
  <div ref="mask" :class="maskClass" v-if="maskVisible">
    <transition @after-leave="onAfterLeave">
      <div class="fc-dialog" v-if="visible" :style="dialogStyles">
        <div class="fc-dialog__container">
          <div class="fc-dialog__header">
            <slot name="header"></slot>
            <button class="fc-dialog__close-btn" @click="close">
              <span class="material-icons">
                close
              </span>
            </button>
          </div>
          <div class="fc-dialog__content">
            <slot name="main"></slot>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  export default {
    props: {
      dialogStyles: null,
      visible: Boolean,
      header: null,
      position: {
        type: String,
        default: 'center'
      }
    },
    data() {
      return {
        dialogClasses: null,
        maskVisible: this.visible,
      }
    },
    computed: {
      maskClass() {
        return ['fc-dialog-mask', this.getPositionClass()];
      },
    },
    methods: {
      close() {
        this.$emit('update:visible', false);
      },
      onAfterLeave() {
        this.maskVisible = false;
      },
      getPositionClass() {
        const positions = ['left', 'right', 'top', 'bottom'];
        const pos = positions.find(item => item === this.position);
        return pos ? `fc-dialog-mask--${pos}` : '';
      },
    },
    updated() {
      if (this.visible && !this.maskVisible) {
        this.maskVisible = true;
      }
    }
  }
</script>
<style lang="scss" scoped>
  .fc-dialog-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;

    &--top {
      align-items: flex-start;
    }
    &--right {
      justify-content: flex-end;
    }
    &--bottom {
      align-items: flex-end;
    }
    &--left {
      justify-content: flex-start;
    }
  }
  .fc-dialog {
    background-color: #ffffff;
    font-size: 2rem;
    min-width: 45rem;
    &__header {
      display: flex;
    }
    &__container {
      margin: 3rem;
    }
    &__close-btn {
      margin-left: auto;
    }
  }
</style>
