<template>
  <div class="fc-layout" v-if="flag"
       tabindex="0"
       @keydown.exact.enter.prevent="selected(layouts[layoutIndex])"
       @keydown.exact.up.prevent="focus(layoutIndex - 1)"
       @keydown.exact.down.prevent="focus(layoutIndex + 1)"
       @keydown.exact.home.prevent="focus(0)"
       @keydown.exact.end.prevent="focus(layouts.length - 1)"
       @keydown.exact.page-up.prevent="focus(layoutIndex - 5)"
       @keydown.exact.page-down.prevent="focus(layoutIndex + 5)"
       @keydown.exact.esc.prevent="toggle"
  >
    <ul class="fc-layout__list">
      <li v-for="(layout, index) in layouts" :key="index">
        <button class="fc-layout__list__item" @click="selected(layout)"
                @focus="focus(index)"
                :class="{active: index === layoutIndex}">
          <img :src="layout.icon" alt="" />
          <span class="fc-layout__list__item__info">
          <strong class="fc-layout__list__item__name">{{ layout.id }}</strong>
          {{ layout.description }}
        </span>
        </button>
      </li>
    </ul>
  </div>
</template>
<script>
  import EventBus from './../../../event-bus/event-bus';

  export default {
    props: {
      layouts: {
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
        EventBus.$emit('add-layer', layout);
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
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../../assets/scss/utils/utilities.scss';
  .fc-layout:before {
    position: absolute;
    bottom: 100%;
    left: calc(50% - 10px);
    height: 0;
    width: 0;
    margin-top: 0;
    border-top: solid transparent;
    border-left: solid transparent;
    border-right: solid transparent;
    border-bottom: solid #fff;
    border-width: 10px;
    pointer-events: none;
    content: " ";
  }

  .fc-layout {
    display: flex;
    position: fixed;
    top:6rem;
    bottom:0;
    right: 2.5rem;
    width: 40rem;
    padding-bottom:2rem;
    z-index: 9999;
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
        width: percentage(1);
        color: $white;

        &__info {
          flex: 1;
          padding-top: 0.5rem;
          padding-left: 1rem;
          padding-bottom: 0.5rem;
          text-align: left;
        }

        &__name {
          display: block;
          margin-bottom: 0.5rem;
        }
      }

      .active {
        border: 2px solid red;
      }
    }
    li {
      & + li {
        margin-top: 1rem;
      }
    }
  }
</style>
