<template>
  <header class="fc-header">
    <h1 class="fc-header__h">FastComposer</h1>
    <div class="fc-header__content">
      <message-toast :message="notificationMessage"/>
    </div>
    <div class="fc-header__right">
      <div class="fc-header__info">
        <span class="fc-header__save-time" v-show="saveTime">최종저장 시간: {{ saveTime }}</span>
      </div>
      <div class="fc-header__utils">
        <button @click="showInfoTags"><i class="material-icons">help</i></button>
        <button type="button" class="fc-utils__btn" @click="showLayerPanel"><i class="material-icons">add</i></button>
      </div>
    </div>
  </header>
</template>

<script>
  import EventBus from '../../event-bus/event-bus';
  import MessageToast from './../common/message-toast';
  import moment from 'moment';

  export default {
    components: {
      MessageToast
    },
    methods: {
      showLayerPanel($event) {
        EventBus.$emit('show-layout-panel', $event);
      },
      showInfoTags() {
        EventBus.$emit('showInfoTags');
      }
    },
    data() {
      return {
        saveTime: null
      }
    },
    props: {
      notificationMessage: {
        type: String,
        default() {
          return {
            message: '',
          }
        }
      },
      notificationType: {
        type: String,
        default() {
          return 'default'
        }
      },
    },
    watch: {
      notificationType (value) {
        if (value === 'success') {
          this.saveTime = moment().format('YYYY.MM.DD HH:mm:ss');
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
    padding: 0 1.8rem;
    width: percentage(1);
    height: $header-size;
    background-color: transparent;
    transform: none; // admin과 충돌 이슈
    transition: none;  // admin과 충돌 이슈

    button {
      color: $white;
    }

    &__h {
      width: 30.2rem;
      font-size: 1.8rem;
      color: $white;
    }

    &__right {
      display: flex;
      width: 26.2rem;
      flex-direction: column;
      > div {
        color: $white;
        height: 3rem;
      }
    }
  }
</style>
