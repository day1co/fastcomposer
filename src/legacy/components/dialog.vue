<template>
  <div ref="mask" :class="maskClass" v-if="maskVisible">
    <transition @after-leave="onAfterLeave">
      <div class="fcc-dialog" v-if="visible" :style="dialogStyles">
        <div class="fcc-dialog__header">
          <slot name="header"></slot>
          <button class="fcc-dialog__close-btn" @click="close">
            <span class="material-icons">
              close
            </span>
          </button>
        </div>
        <div class="fcc-dialog__content">
          <slot name="main"></slot>
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
        return ['fcc-dialog-mask', this.getPositionClass()];
      },
    },
    methods: {
      close() {
        this.$emit('close');
      },
      onAfterLeave() {
        this.maskVisible = false;
      },
      getPositionClass() {
        const positions = ['left', 'right', 'top', 'bottom'];
        const pos = positions.find(item => item === this.position);
        return pos ? `fcc-dialog-mask--${pos}` : '';
      },
    },
    updated() {
      if (this.visible && !this.maskVisible) {
        this.maskVisible = true;
      }
    }
  }
</script>
<style lang="scss">
.fcc-dialog-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;

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

.fcc-dialog {
  background-color: #ffffff;
  color: #111;
  font-size: 2rem;
  min-width: 45rem;
  max-height: min(60rem, calc(100% - 4rem));

  display: flex;
  flex-direction: column;
  gap: .5rem;

  padding: 2rem 3rem;
  overflow: hidden;
  min-height: 0;

  &__header {
    display: flex;
  }
  &__content {
    min-height: 0;
    overflow-y: auto;
  }
  &__close-btn {
    margin-left: auto;
    color: inherit;
  }
}
</style>
