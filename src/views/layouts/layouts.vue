<template>
  <div class="fc-layout" v-if="flag"
       tabindex="0"
       @keydown.exact.enter.prevent="selected(layouts[layoutIndex])"
       @keydown.exact.space.prevent="selected(layouts[layoutIndex])"
       @keydown.exact.up.prevent="focus(layoutIndex - 1)"
       @keydown.exact.down.prevent="focus(layoutIndex + 1)"
       @keydown.exact.home.prevent="focus(0)"
       @keydown.exact.end.prevent="focus(layouts.length - 1)"
       @keydown.exact.page-up.prevent="focus(layoutIndex - 5)"
       @keydown.exact.page-down.prevent="focus(layoutIndex + 5)"
       @keydown.exact.esc.prevent="toggle"
  >
    <!-- TODO: favorite layouts here? reimpl as sidebar?-->
    <ul class="fc-layout__list">
      <li v-for="(layout, index) in layouts" :key="index"
          class="fc-layout__list__item">
        <button @click="selected(layout)" @focus="focus(index)"
                class="fc-layout__list__button"
                :class="{ active: index === layoutIndex }">
          <layout-info :layout="layout" />
        </button>
        <button @click="onAddFavoriteLayout(layout.id)"
                class="fc-layout__list__favorite"
                tabindex="-1">
          <i class="material-icons">
            {{ favoriteLayoutIds.includes(layout.id)? 'favorite' : 'favorite_border' }}
          </i>
        </button>
      </li>
    </ul>
  </div>
</template>
<script>
  import LayoutInfo from '../../components/layout-info.vue';

  export default {
    components: {
      LayoutInfo
    },
    props: {
      layouts: {
        type: Array,
        default() {
          return []
        }
      },
      favoriteLayoutIds: {
        type: Array,
        default() {
          return []
        }
      },
    },
    data() {
      return {
        layoutIndex: 0,
        savedFocus: null,
        flag: false
      }
    },
    methods: {
      selected(layout) {
        /**
         * composer에서 layers에 push가 일어나며, 추가된 layer가 선택된다.
         */
        this.$emit('add-layer', layout);
        this.flag = false;
      },
      toggle() {
        this.flag = !this.flag;
        this.$nextTick(() => {
          if(this.flag) {
            // XXX: save current focus to restore focus for cancel
            this.savedFocus = document.activeElement;
            this.$el.focus();
          } else {
            // XXX: restore focus if possible
            if (this.savedFocus) {
              this.savedFocus.focus();
              this.savedFocus = null;
            }
          }
        });
      },
      focus(index) {
        this.layoutIndex = Math.min(Math.max(index, 0), this.layouts.length - 1);
      },
      onAddFavoriteLayout(layoutId) {
        this.$emit('add-favorite-layout', layoutId);
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/utils/utilities';
  .fc-layout:before {
    position: absolute;
    left: 100%;
    top: 4.2rem;
    height: 0;
    width: 0;
    margin-top: 0;
    border-top: solid transparent;
    border-left: solid #fff;
    border-right: solid transparent;
    border-bottom: solid transparent;
    border-width: 1rem;
    pointer-events: none;
    content: " ";
  }

  .fc-layout {
    display: flex;
    position: fixed;
    top: 8rem;
    bottom:0;
    right: 4rem;
    width: 40rem;
    padding-bottom:2rem;
    z-index: 19999;
    color: $foreground;

    &__list {
      overflow: scroll;
      box-sizing: border-box;
      border: 0.1rem solid #ffffff;
      padding: 1.2rem 0.9rem;
      width: 100%;
      height: percentage(1);
      background-color: $secondary;

      &__item {
        display: flex;
        flex-direction: row;
      }

      &__button {
        display: flex;
        flex-grow: 100;
        margin-right: 0.8rem;
        color: inherit;
      }
      &__favorite {
        color: $foreground;
      }

      .active {
        box-shadow: 0 0 0 0.2rem red;
      }
    }
    li {
      & + li {
        margin-top: 1rem;
      }
    }
  }
</style>
