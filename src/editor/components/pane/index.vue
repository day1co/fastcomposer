<template>
  <article class="composer-pane-wrap">
    <ul class="composer-pane-tab-list" role="tablist">
      <li class="composer-pane-tab active">
        <button tabindex="-1">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M4 6.5l3,3l3,-3" />
          </svg>
        </button><!--
    -->{{ title }}
      </li>
    </ul>
    <section class="composer-pane">
      <slot></slot>
    </section>
  </article>
</template>

<script>

export default {
  props: {
    title: String
  }
}

</script>

<style lang="sass">

.composer-pane
  display: flex
  flex-direction: column
  flex-grow: 1

  min-height: 2rem

  background: var(--c-bg)
  box-shadow: inner-border-except-for(top)

  &-content
    flex: 1 1 auto

    margin: 0.5rem

    min-height: 0
    overflow-y: auto
    // scroll-snap-type: y mandatory // does not target nested items

    &.inner-border
      box-shadow: 0 0 0 $_1px var(--c-regional-hint)

  &-wrap
    @include visual-box-outer
    display: flex
    flex-direction: column
    flex: 1 1 auto

    min-height: 0
    overflow: hidden

    box-shadow: inner-border-for(all)

  &-tab-list
    @include visual-box-outer
    display: flex
    align-items: stretch
    justify-content: flex-start
    flex-shrink: 0

  &-tab
    // @mixin visual-box-flat
    // padding: 0 0.625rem
    // box-shadow: inner-border-except-for(bottom)
    // line-height: 2.5rem
    // display: flex
    flex-grow: 1

    padding: 0 0.625rem
    line-height: 2rem

    background: var(--c-bg-outer)

    box-shadow: inner-border-for(all)

    // &.active
    //   background: var(--c-bg)

    > button
      @include clickable
      width: 0.875rem
      height: calc(100% - 0.125rem)

      vertical-align: top

      margin: 0 0.125rem 0 -0.25rem

      transform: translateY(0.125rem * 0.5)

      > svg
        vertical-align: baseline

    &:not(.active) > button
      visibility: hidden

</style>
