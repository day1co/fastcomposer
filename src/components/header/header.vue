<template>
  <header class="fc-header">
    <h1 class="fc-header__h">FastComposer</h1>
    <div class="fc-header__content">
      <message-toast :message="message"/>
    </div>
    <div class="fc-header__utils">
      <button type="button" class="fc-utils__btn" @click="showLayerPanel"><i class="material-icons">add</i></button>
    </div>
  </header>
</template>

<script>
  import EventBus from '../../event-bus/event-bus';
  import MessageToast from './../common/message-toast';

  export default {
    components: {
      MessageToast
    },
    methods: {
      showLayerPanel($event) {
        EventBus.$emit('show-layout-panel', $event);
      }
    },
    props: {
      message: {
        type: String,
        default () {
          return '';
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import './../../assets/scss/style.scss';

  .fc-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 101;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 1.8rem;
    padding-right: 1.8rem;
    width: percentage(1);
    height: $header-size;
    &__h {
      font-size: 1.8rem;
      color: $white;
    }

    &__utils {
      display: flex;
      width: 266px;

      .fc-utils__btn {
        margin-left: 0.8rem;
        color: $white;
        align-items: center;
      }
    }
  }
</style>
