<template>
  <div class="fcc-layout">
    <!-- TODO: favorite layouts here? reimpl as sidebar?-->
    <div class="fcc-layout--wrapper">
      <div class="fcc-layout--search">
        <svg
          class="fcc-layout--search__icon"
          viewBox="0 0 30 30"
          fill="none"
          stroke="currentColor"
          stroke-width="2">
          <circle cx="12" cy="12" r="6" />
          <path d="M16 16l7 7" />
        </svg>
        <input
          type="search"
          ref="search"
          v-model="query"
          class="fcc-layout--search__input"
          @keydown="keydown" />
      </div>

      <ul class="fcc-layout__list">
        <li
          v-for="([name, layout], index) in searchResult"
          :key="index"
          ref="layouts"
          class="fcc-layout__list__item">

          <button
            @click="selected(layout)"
            class="fcc-layout__list__button"
            :class="{ active: index === focus }">
            <layout-info :layout="layout" class="small" />
          </button>

          <button
            @click="onAddFavoriteLayout(layout.id)"
            class="fcc-layout__list__favorite"
            tabindex="-1">
            <i class="material-icons">
              {{ favoriteLayoutIds.includes(layout.id)? 'favorite' : 'favorite_border' }}
            </i>
          </button>
        </li>
        <li
          v-if="!searchResult.length"
          class="fcc-layout__list__item--notfound">
          검색 결과가 없습니다.
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
    layouts: {
      type: Map,
      default() {
        return new Map()
      }
    },
    favoriteLayoutIds: {
      type: Array,
      default() {
        return []
      }
    },
  },
  data() {
    return {
      query: '',
      focus: null
    }
  },
  methods: {
    clear() {
      this.query = ''
      this.$refs.search.focus()
    },
    selected(layout) {
      this.$emit('add-layer', layout.id);
    },
    keydown(event) {
      let direction = 0
      switch(event.key) {
        case 'ArrowUp':
          direction ||= -1
        case 'ArrowDown':
          direction ||= +1

          const length = this.searchResult.length

          if(length <= 0) { // pressing ↑↓ without search results
            this.focus = null
            break
          }

          if(this.focus === null)
            if(direction > 0) // pressing ↓ without anything focused
              this.focus = 0
            else
              break
          else
            this.focus = Math.min(this.focus + direction, length - 1)

          if(this.focus < 0) // pressing ↑ when topmost selected
            this.focus = null

          if(direction < 0) {
            // pressing ↑ should not move cursor while navigating
            event.preventDefault()
            if(this.focus === null)
              this.$refs.search.select()
          }

          this.$nextTick(() => this.scrollIntoFocused())
          break

        case 'Enter':
          if(this.focus == null)
            if(this.searchResult.length !== 1)
              break
          this.selected(this.searchResult[this.focus ?? 0][1])
          break

        default:
          this.scrollIntoFocused(0)
          this.focus = null
      }
    },
    scrollIntoFocused(index = this.focus) {
      this.$refs.layouts?.[index]?.scrollIntoViewIfNeeded?.({ block: 'nearest' })
    },
    onAddFavoriteLayout(layoutId) {
      this.$emit('add-favorite-layout', layoutId);
    },
  },
  computed: {
    searchResult() {
      if(!this.query)
        return [...this.layouts.entries()]
      else
        return [...this.layouts.entries()].filter(([k, v]) =>
          k.includes(this.query) || v?.meta?.description?.includes?.(this.query)
        ).map(([k, v]) => {
          let weight = 0
          weight |= k.startsWith(this.query) * 8
          if(!weight) {
            weight |= v?.meta?.description?.startsWith?.(this.query) * 4
            weight |= v?.meta?.description?.includes?.(this.query) * 2
          }
          return [k, v, weight]
        }).sort((a, b) => b[2] - a[2])
    }
  }
}
</script>

<style lang="scss" scoped>

@import '../assets/scss/utils/utilities';


.fcc-layout {
  position: absolute;
  top: 3.6rem;
  bottom: 0;
  right: 0;

  width: 100%;
  max-width: 40rem;
  z-index: 9999;
  color: $foreground;

  box-sizing: border-box;
  background-color: $secondary;

  border: 0.1rem solid $foreground;

  &::before {
    display: block;
    content: '';

    position: absolute;
    right: 0.5rem;
    bottom: 100%;

    border: 1rem solid;
    border-color: #fff0 #fff0 $foreground #fff0;

    pointer-events: none;
  }

  &--wrapper {
    display: grid;
    grid-template-rows: 3rem minmax(0, 1fr);
    height: 100%;
  }

  &--search {
    display: flex;

    position: sticky;
    top: 0;

    &__icon {
      position: absolute;
      height: 100%;
    }

    &__input {
      width: 100%;
      padding: 0.4rem 0.8rem;
      text-indent: 2rem;
      border: none;
      border-bottom: 0.1rem solid $foreground;

      font: inherit;

      &:focus {
        outline: none;
        box-shadow: 0 0 0 0.2rem $primary-active inset;
      }
    }
  }

  &__list {
    min-height: 0;
    overflow-y: auto;
    padding: 0.4rem 0;

    &__item {
      display: flex;
      flex-direction: row;
      padding: 0.4rem 0.8rem;

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
      min-width: 0;
      overflow: hidden;
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
