<template>
  <ul class="fc-aside__list">
    <template v-for="(layoutKit, index) in layoutKits">
      <li :key="index">
        <button class="fc-layout-kit__item" @click="selected(layoutKit)">
          <img :src="layoutKit.icon" alt="" />
          <span class="fc-layout-kit__item__info">
            <strong class="fc-layout-kit__item__name">{{ layoutKit.id }}</strong>
            {{ layoutKit.description }}
          </span>
        </button>
      </li>
    </template>
  </ul>
</template>
<script>
  import EventBus from './../../../../event-bus/event-bus';
  export default {
    name: 'layout-kits',
    props: {
      layoutKits: {
        type: Array,
        default() {
          return []
        }
      }
    },
    methods: {
      selected(layoutKit) {
        /**
         * composer에서 layers에 push가 일어나며, 추가된 layer가 선택된다.
         */
        EventBus.$emit('addLayer', layoutKit);
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
  }
</style>
