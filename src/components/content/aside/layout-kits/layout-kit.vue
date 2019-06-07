<template>
  <li>
    <button class="fc-layout-kit__item" @click="selected(layoutKit)">
      <img :src="layoutKit.icon" alt="" />
      <span class="fc-layout-kit__item__info">
        <strong class="fc-layout-kit__item__name">{{ layoutKit.id }}</strong>
        {{ layoutKit.description }}
      </span>
    </button>
  </li>
</template>

<script>
  import EventBus from './../../../../event-bus/event-bus';
  export default {
    name: 'layout-kit',
    props: {
      layoutKit: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      selected() {
        /**
         * composer에서 layers에 push가 일어나며, 추가된 layer가 선택된다.
         */
        EventBus.$emit('addLayer', this.layoutKit);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../assets/scss/utils/utilities.scss';

  .fc-layout-kit {
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
</style>
