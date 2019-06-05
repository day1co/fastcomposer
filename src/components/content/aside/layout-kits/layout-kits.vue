<template>
  <ul class="fc-aside__list">
    <template v-for="(layoutKit, index) in layoutKits">
      <layout-kit
        :key="index"
        :layoutKit="layoutKit"
        @onClick="$emit('select', layoutKit)"/>
    </template>
  </ul>
</template>
<script>
  import LayoutKit from './layout-kit';
  export default {
    name: 'layout-kits',
    components: {
      LayoutKit
    },
    props: {
      layoutKits: {
        type: Array,
        default() {
          return []
        }
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
  }
</style>
