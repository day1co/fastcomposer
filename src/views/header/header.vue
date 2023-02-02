<template>
  <header :class="[
    'fc-header',
    !favoriteLayouts.length && 'fc-header--no-favorites'
  ]">
    <div class="fc-header__h">
      <h1>FastComposer</h1>
      <span class="fc-header__subtitle">
        버전 {{ version }}
        <span v-show="saveTime">・ 최종 저장: {{ saveTime }}</span>
      </span>
    </div>
    <!-- TODO: move/reimpl elsewhere -->
    <ul class="fc-header__favorite-layouts" v-if="favoriteLayouts.length">
      <li class="fc-header__favorite-layout" v-for="(layout, index) in favoriteLayouts" :key="index">
        <button class="fc-header__favorite-btn" @click="addLayer(layout)">
          <img :src="layout.icon" alt="" />
          {{ layout.id }}
        </button>
      </li>
    </ul>
  </header>
</template>

<script>
  import packageinfo from '../../../package.json';

  export default {
    methods: {
      showLayerPanel($event) {
        this.$emit('show-layout-panel', $event);
      },
      addLayer(layout) {
        this.$emit('add', layout);
      },
    },
    data() {
      return {
        saveTime: null,
        version: packageinfo.version,
      }
    },
    computed: {
      favoriteLayouts() {
        return this.layouts.filter((layout) => this.favoriteLayoutIds.includes(layout.id));
      }
    },
    props: {
      // TODO cleanup unknowns & dirties (where's notif?) */
      favoriteLayoutIds: {
        type: Array,
        default() {
          return [];
        }
      },
      notificationMessage: {
        type: String,
        default() {
          return ''
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
      },
      layerCount: {
        type: Number,
        default() {
          return 0;
        }
      },
      warnCount: {
        type: Number,
        default() {
          return 0;
        }
      }
    },
    watch: {
      notificationType (value) {
        if (value === 'success') {
          const d = new Date();

          this.saveTime = `
            ${d.getFullYear().toString().padStart(4, '0')}.
            ${(d.getMonth()+1).toString().padStart(2, '0')}.
            ${d.getDate().toString().padStart(2, '0')}
            ${d.getHours().toString().padStart(2, '0')}:
            ${d.getMinutes().toString().padStart(2, '0')}:
            ${d.getSeconds().toString().padStart(2, '0')}
          `;
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/style';

  .fc-header {
    position: fixed;
    top: 0;
    left: 0;
    /* z-index: 101; */
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: percentage(1);
    height: $header-size;
    background-color: transparent;
    transform: none; // admin과 충돌 이슈
    transition: none;  // admin과 충돌 이슈

    /* TODO reconsider with other layout elms */
    &--no-favorites {
      height: $header-size * 0.5;

      .fc-header__h {
        width: 100%;
        display: flex;
      }
      .fc-header__subtitle {
        margin-left: 1.2rem;
        line-height: 2.8rem;
      }
    }

    &__favorite-layouts {
      display: flex;
      flex-grow: 100;
      justify-items: flex-end;
      width: 100%;
      height: 7.1rem;
      padding: 0 1.6rem 0 0.8rem;
      overflow-x: scroll;
    }
    &__favorite-layout {
      margin-right: 1rem;
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
      height: 100%;
      padding-top: 1rem;
      flex-grow: 100;
    }

    &__h {
      min-width: 24rem;
      color: $white;
      padding: 0 0.8rem 0 1.6rem;

      > h1 {
        font-size: 1.8rem;
        line-height: 1.5;
      }
    }

    &__right {
      width: 26.1rem;
      margin-left: auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      padding-left: 2.1rem;
      > div {
        color: $white;
      }
    }
    &__info {
      display: flex;
      flex-direction: column;
    }
  }
</style>
