<template>
  <header class="fcc-header">
    <h1 class="fcc-header__h">FastComposer</h1>
    <div class="fcc-header__content">
      <message-toast :message="notificationMessage"/>
    </div>
    <div class="fcc-header__utils">
      <button type="button" class="fcc-utils__btn" @click="showLayerPanel"><i class="material-icons">add</i></button>
    </div>
    <div class="fcc-header__info">
      <span class="fcc-header__save-time" v-show="saveTime">최종저장 시간: {{ saveTime }}</span>
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

  .fcc-header {
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
      flex-grow: 1;
    }

    &__content {
      flex-grow: 23;
    }

    &__utils {
      flex-grow: 0.3;
      .fcc-utils__btn {
        color: $white;
        align-items: center;
      }
    }

    &__info {
      flex: 1 1 130px;
    }

    &__save-time {
      text-align: center;
      color: #ffffff;
    }
  }
</style>
