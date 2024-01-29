<template>
  <div class="fcc-snippets">
    <div class="fcc-snippets--wrapper">

      <ul class="fcc-snippets__list">
        <li class="fcc-snippets__list__item" v-for="snippet of snippets" @click="addSnippet(snippet)">
          <svg width="24" height="24">
            <path d="m1 1v16h16V1zm4 4v16h16V4z" fill="black" stroke="red" stroke-width="2" />
          </svg>
          <h3> {{ snippet.title }} </h3>
          <p> {{ describeSnippet(snippet.layers) }} </p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>

import LayoutInfo from '../components/layout-info.vue';

export default {
  components: {
    LayoutInfo
  },
  props: {
    snippets: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  methods: {
    addSnippet(snippet) {
      this.$emit('add-layers', snippet)
    },
    describeSnippet(layers) {
      let label = layers.slice(0, 3).map(_ => _.layout).join(', ')
      if(layers.length > 3) {
        label += '…'
      }
      label += ` (x${layers.length})`
      return label
    }
  }
}
</script>

<style lang="scss" scoped>

@import '../assets/scss/utils/utilities';


.fcc-snippets {
  position: absolute;
  top: 6.4rem;
  bottom: 0;
  right: 0;

  width: 100%;
  max-width: 40rem;
  z-index: 19999;
  color: $foreground;

  box-sizing: border-box;
  background-color: $secondary;

  border: 0.1rem solid #ffffff;

  &::before {
    display: block;
    content: '';

    position: absolute;
    right: 2.7rem;
    bottom: 100%;

    border: 1rem solid;
    border-color: #fff0 #fff0 #fff #fff0;

    pointer-events: none;
  }

  &--wrapper {
    display: grid;
    grid-template-rows: 3rem minmax(0, 1fr);
    height: 100%;
  }

  &__list {
    min-height: 0;
    // overflow-y: auto;
    padding: 0.4rem 0;

    &__item{
      display: flex;
      flex-direction: row;
      gap: 0.4em;
      padding: 0.4rem 0.8rem;

      word-break: nowrap;
      white-space: keep-all;

      &--notfound {
        padding: 3.2rem 0;
        text-align: center;
        opacity: 0.5;
      }

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
}

</style>
