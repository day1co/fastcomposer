<template>
  <header class="fc-header">
    <h1 class="fc-header__h">FastComposer</h1>
    <div class="fc-header__content">
      <ul class="fc-header__favorite-layouts">
        <li class="fc-header__favorite-layout" v-for="(layout, index) in favoriteLayouts" :key="index">
          <button class="fc-header__favorite-btn" @click="addLayer(layout)">
            <img :src="layout.icon" alt="" />
            {{ layout.id }}
          </button>
        </li>
      </ul>
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
      },
      addLayer(layout) {
        EventBus.$emit('add-layer', layout);
      },
      getLayoutIds() {
        return JSON.parse(localStorage.getItem('favoriteLayouts')) || [];
      },
      addFavoriteLayer(layout) {
        if (this.layoutIds.includes(layout.id)) {
          this.layoutIds.splice(this.layoutIds.indexOf(layout.id), 1);
        } else {
          this.layoutIds.push(layout.id);
        }

        localStorage.setItem('favoriteLayouts', JSON.stringify(this.layoutIds));
      },
      init() {
        this.layoutIds = this.getLayoutIds();
      }
    },
    data() {
      return {
        saveTime: null,
        layoutIds: [],
      }
    },
    computed: {
      favoriteLayouts() {
        return this.layouts.filter((layout) => this.layoutIds.includes(layout.id));
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
      layouts: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    created() {
      this.init();
      EventBus.$on('add-favorite-layer', this.addFavoriteLayer);
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

    &__favorite-layouts {
      display: flex;
      width: 100%;
      overflow-x: scroll;
    }
    &__favorite-layout {
      width: 5rem;
      margin-left: 1rem;
      text-align: center;
      &:first-child {
        margin-left: 0;
      }
    }
    &__favorite-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        max-width: none;
      }
    }

    button {
      color: $white;
    }

    &__content {
      .fc-composer--aside-l & {
        padding-left: 32rem;
      }
      .fc-composer--aside-r & {
        padding-right: 33rem;
      }
      width: 100%;
    }

    &__h {
      position: absolute;
      left: 0;
      width: 30rem;
      font-size: 1.8rem;
      color: $white;
    }

    &__right {
      position: absolute;
      right: 0;
      display: flex;
      flex-direction: column;
      width: 26rem;
      > div {
        color: $white;
        height: 3rem;
      }
    }
  }
</style>
