<template>
  <header :class="[
    'fcc-header',
    !favoriteLayouts.length && 'fcc-header--no-favorites'
  ]">
    <div class="fcc-header__h">
      <h1>FastComposer</h1>
      <span class="fcc-header__subtitle">
        버전 {{ version }}
        <span v-show="saveTime">・ 최종 저장: {{ saveTime }}</span>
      </span>
    </div>
    <!-- TODO: move/reimpl elsewhere -->
    <ul class="fcc-header__favorite-layouts" v-if="favoriteLayouts.length">
      <li class="fcc-header__favorite-layout" v-for="(layout, index) in favoriteLayouts" :key="index">
        <button class="fcc-header__favorite-btn" @click="addLayer(layout.id)">
          <img :src="toIcon(layout.icon)" alt="" />
          {{ layout.id }}
        </button>
      </li>
    </ul>
    <slot>
    </slot>
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
      toIcon(icon) {
        if(!icon) {
          return
        } else if(/^<(?:\?xml |svg )/.test(icon)) {
          return 'data:image/svg+xml;utf8,' + encodeURIComponent(icon)
        } else if(/^data:image\//.test(icon)) {
          return icon
        } else {
          return null
        }
      }
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
  @import '../assets/scss/style';

  .fcc-header {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: percentage(1);
    background-color: transparent;
    transform: none; // admin과 충돌 이슈
    transition: none;  // admin과 충돌 이슈

    white-space: nowrap;
    word-break: keep-all;

    /* TODO reconsider with other layout elms */
    .fcc-composer__simple-favorites &, &--no-favorites {

      .fcc-header__h {
        display: flex;
        margin-right: auto;
        padding: 0.6rem 1.2rem;
      }
      .fcc-header__subtitle {
        margin-left: 1.2rem;
        line-height: 2.8rem;
      }
    }

    &__favorite-layouts {
      display: flex;
      gap: 0.4rem;
      flex-grow: 100;
      justify-items: flex-end;
      width: 100%;
      margin: 0 0.8rem;
      padding: 0;
      overflow-x: auto;
      overflow-y: hidden;

      .fcc-composer__simple-favorites & {
        gap: 0;
      }
    }
    &__favorite-layout {
      display: flex;
      flex-direction: column;
      text-align: center;
      align-items: center;
      justify-content: center;

      .fcc-composer__simple-favorites & {
        flex-direction: row;
      }
    }
    &__favorite-btn {
      @include readable-font-features;

      flex-direction: column;
      gap: 0 !important;
      line-height: 1.25em;

      .fcc-composer__simple-favorites & {
        flex-direction: row;
        gap: 0.4rem !important;
      }

      img {
        width: 5rem;
        height: 5rem;
        max-width: none;

        .fcc-composer__simple-favorites & {
          width: 3rem;
          height: 3rem;
        }
      }
    }

    button {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: $foreground;
      height: 100%;
      padding: 0.4em;
      background-color: transparent;
      transition: background-color 200ms ease;

      .material-icons {
        vertical-align: bottom;
      }
      label {
        white-space: nowrap;
        word-break: keep-all;
      }

      &:hover {
        background-color: #8883;
      }
    }

    &__content {
      height: 100%;
      padding-top: 1rem;
      flex-grow: 100;
    }

    &__h {
      min-width: 24rem;
      color: $foreground;
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
        color: $foreground;
      }
    }
    &__info {
      display: flex;
      flex-direction: column;
    }

    ::-webkit-scrollbar {
      width: 0.3rem;
      height: 0.3rem;
      background: #6668;
    }
    ::-webkit-scrollbar-thumb {
      background: $foreground;
      border-radius: 0;
    }
  }
</style>
