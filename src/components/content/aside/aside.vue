<template>
  <div
    class="fc-aside"
    :class="['fc-aside-' + className]">
    <div class="fc-aside__content">
      <div class="fc-aside__container">
        <slot></slot>
      </div>
    </div>

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
  export default {
    props: {
      className: {
        type: String,
        default() {
          return '';
        }
      },
    },
    methods: {
      toggleAside() {
        EventBus.$emit('toggle-aside', this.className);
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

    &__content {
      width: 100%;
    }

    &__container {
      overflow: scroll;
      box-sizing: border-box;
      padding: 1.2rem 0.9rem;
      height: percentage(1);
      background-color: $secondary;
    }

    &__btn {
      position: absolute;
      top: 50%;
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

  .fc-aside-right {
    right: 0;

    .fc-composer--aside-r & {
      transform: translate3d(0, 0, 0);
    }

    .fc-aside__btn {
      left: 0;
    }
  }

  .fc-aside-left {
    left: 0;
    max-width: $sidebar-size + 4rem;
    transform: translate3d(-100%, 0, 0);

    .fc-composer--aside-l & {
      transform: translate3d(0, 0, 0);
    }

    .fc-aside__btn {
      right: 0;
      transform: translate3d(100%, -50%, 0) rotate(180deg);
    }
  }
</style>
