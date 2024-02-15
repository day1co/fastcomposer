<template>
  <div class="fcc-snippets">
    <ul class="fcc-snippets-list">
      <li class="fcc-snippet" v-for="snippet of snippets" @click="addSnippet(snippet)">
        <div class="fcc-snippet-icon" :data-layers="snippet.layers.length">
          <img
            class="fcc-snippet-icon-inner"
            v-for="layer of snippet.layers.slice(0, 3).reverse()"
            :src="getLayoutIcon(layer.layout)" />
        </div>
        <div class="fcc-snippet-label">
          <h3 class="fcc-snippet-title" :title="snippet.title"> {{ snippet.title }} </h3>
          <p class="fcc-snippet-description"> {{ describeSnippet(snippet.layers) }} </p>
        </div>
        <button class="fcc-snippet-action">
          <i class="material-icons">delete</i>
        </button>
      </li>
      <li class="fcc-snippet--empty" v-if="!snippets?.length">
        <h4>스니펫이 없습니다</h4>
        <p>레이어를 선택하고 '스니펫'을 눌러서 저장하세요</p>
      </li>
    </ul>
  </div>
</template>

<script>

import Page from '../../page'

import LayoutInfo from '../components/layout-info.vue';
import { iconToUri } from '../../util/index.ts'

export default {
  components: {
    LayoutInfo
  },
  props: {
    snippets: {
      type: Array,
      default: () => []
    },
    page: {
      type: Page
    }
  },
  data: () => ({
  }),
  methods: {
    addSnippet(snippet) {
      this.$emit('add-layers', snippet)
    },
    describeSnippet(layers) {
      let label = layers.slice(0, 2).map(_ => _.layout).join(', ')
      if(layers.length > 2) {
        label += '…'
      }
      label += ` (x${layers.length})`
      return label
    },
    getLayoutIcon(layoutId) {
      try {
        const layout = this.page.getLayout(layoutId)
        return iconToUri(layout.meta.icon)
      } catch(e) {
        return ''
      }
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
  z-index: 9999;
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

  &-list {
    display: flex;
    flex-direction: column;
    padding: 0.8rem;
    gap: 0.8rem;

    height: 100%;
    min-height: 0;
    overflow-y: auto;
  }
}

.fcc-snippet {
  display: flex;

  user-select: none;
  cursor: pointer;

  &-icon {
    flex-shrink: 0;

    position: relative;

    width: 5rem;
    height: 5rem;

    .fcc-snippet-icon-inner {
      position: absolute;
      left: 0;
      top: 0;

      width: 70%;
      height: 70%;
      + .fcc-snippet-icon-inner {
        left: 15%;
        top: 15%;
        + .fcc-snippet-icon-inner {
          left: 30%;
          top: 30%;
        }
      }
    }

    &[data-layers="1"] .fcc-snippet-icon-inner {
      width: 90%;
      height: 90%;
    }

    &[data-layers="2"] .fcc-snippet-icon-inner {
      width: 80%;
      height: 80%;
      + .fcc-snippet-icon-inner {
        left: 20%;
        top: 20%;
      }
    }
  }

  &-label {
    display: flex;
    flex-direction: column;
    line-height: 1.8rem;
    margin-left: 0.8rem;
    padding: 0.7rem 0;

    flex-grow: 1;
    min-width: 0;

    white-space: nowrap;
    word-break: keep-all;
  }
  &-title {
    font-size: 1.2em;
    text-overflow: ellipsis;
    overflow: hidden;
    flex-shrink: 1;
    min-width: 0;
  }
  &-description {
    font-size: 1em;
    white-space: nowrap;
    word-break: keep-all;
    flex-shrink: 0;
  }
  &-action {
    padding: 0.4rem;

    &:hover {
      background: #8883;
    }
  }

  .fcc-composer__simple-layers & {
    // grid-template-columns: 3.2rem auto auto;
    // grid-template-rows: auto auto;

    &-icon {
      width: 3.2rem;
      height: 3.2rem;
    }

    &-label {
      flex-direction: row;
      gap: 0.4rem;
    }
  }

}

</style>
