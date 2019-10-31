<template>
  <div class="fc-layout" v-if="flag"
    :style="layoutStyle"
  >
    <ul class="fc-layout__list">
      <li v-for="(layout, index) in layouts" :key="index">
        <button class="fc-layout__list__item" @click="selected(layout)">
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
      layoutStyle: {
        type: Object
      }
    },
    data() {
      return {
        flag: false
      }
    },
    methods: {
      selected(layout) {
        /**
         * composer에서 layers에 push가 일어나며, 추가된 layer가 선택된다.
         */
        EventBus.$emit('add-layer', layout);
      },
      toggle() {
        this.flag = !this.flag;
      }
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
    width: 60%;
    padding-bottom:2rem;
    right: 0;
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
    }
    li {
      & + li {
        margin-top: 1rem;
      }
    }
  }
</style>
