<template>
  <ul class="fc-aside__list">
    <li v-for="(layout, index) in layouts" :key="index">
      <button class="fc-layout__item" @click="selected(layout)">
        <img :src="layout.icon" alt="" />
        <span class="fc-layout__item__info">
          <strong class="fc-layout__item__name">{{ layout.id }}</strong>
          {{ layout.description }}
        </span>
      </button>
    </li>
  </ul>
</template>
<script>
  import EventBus from './../../../../event-bus/event-bus';
  export default {
    props: {
      layouts: {
        type: Array,
        default() {
          return []
        }
      }
    },
    methods: {
      selected(layout) {
        /**
         * composer에서 layers에 push가 일어나며, 추가된 layer가 선택된다.
         */
        EventBus.$emit('add-layer', layout);
      }
    }
  }
</script>
<style lang="scss">
  @import '../../../../assets/scss/utils/utilities.scss';
  .fc-aside {
    &__list {
      overflow: scroll;
      box-sizing: border-box;
      padding: 1.2rem 0.9rem;
      height: percentage(1);
      background-color: $secondary;

      li {
        & + li {
          margin-top: 1rem;
        }
      }
    }

    .fc-layout {
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
  }
</style>
