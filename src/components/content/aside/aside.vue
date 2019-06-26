<template>
  <div class="fc-aside">
    <layers
      :layers="layers"
    />
    <layouts
      :layouts="layouts"
    />
    <button
      type="button"
      class="fc-aside__btn"
      @click="toggleAside">
      <i class="material-icons">&#xE3E8;</i>
    </button>
  </div>
</template>
<script>
  import EventBus from './../../../event-bus/event-bus';
  import Layers from './layers/layers';
  import Layouts from './layouts/layouts';
  export default {
    components: {
      Layers,
      Layouts
    },
    props: {
      layouts: {
        type: Array,
        default() {
          return []
        }
      },
      layers: {
        type: Array,
        default() {
          return []
        }
      },
    },
    methods: {
      toggleAside() {
        EventBus.$emit('toggle-aside');
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../assets/scss/utils/utilities.scss';

  .fc-aside {
    display: flex;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    box-sizing: border-box;
    padding-top: $header-size;
    padding-bottom: 2rem;
    width: percentage(1);
    max-width: $sidebar-size;
    color: $white;
    transform: translate3d(100%, 0, 0);
    @include transition(null, 0.3s);

    .fc-composer--flush & {
      padding-top: 0;
      padding-bottom: 0;
    }

    .fc-composer--aside & {
      transform: translate3d(0, 0, 0);
    }

    &__btn {
      position: absolute;
      top: 50%;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.8rem 0 1.8rem 0.6rem;
      background-color: $secondary;
      border-top-left-radius: 0.5rem;
      border-bottom-left-radius: 0.5rem;
      color: $white;
      transform: translate3d(-100%, -50%, 0);
    }
  }
</style>
