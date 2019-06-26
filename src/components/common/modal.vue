<template>
  <transition name="modal">
    <div class="fc-modal-mask">
      <div class="fc-modal-mask__wrapper">
        <div class="fc-modal-mask__wrapper__container">
          <div class="fc-modal-mask__wrapper__container__header">
            <slot name="header"></slot>
          </div>

          <div class="fc-modal-mask__wrapper__container__body">
            <slot name="body"></slot>
          </div>

          <div class="fc-modal-mask__wrapper__container__footer">
            <slot name="footer">
              <button class="fc-modal-mask__wrapper__container__default-button" @click="$emit('close')">
                OK
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  export default {
    name: 'modal'
  }
</script>

<style lang="scss" scope>
  .fc-modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;

    &__wrapper {
      display: table-cell;
      vertical-align: middle;

      &__container {
        width: 300px;
        margin: 0 auto;
        padding: 20px 30px;
        background-color: #1976d2;
        color: #ffffff;
        border-radius: 2px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
        transition: all .3s ease;
        font-family: Helvetica, Arial, sans-serif;

        &__header {
          h3 {
            margin-top: 0;
            color: #42b983;
          }
        }

        &__body {
          margin: 20px 0;
        }

        &__default-button {
          float: right;
          color: #ffffff;
        }
      }
    }
  }

  .fc-modal-enter {
    opacity: 0;
  }

  .fc-modal-leave-active {
    opacity: 0;
  }

  .fc-modal-enter .fc-modal-container,
  .fc-modal-leave-active .fc-modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
</style>
