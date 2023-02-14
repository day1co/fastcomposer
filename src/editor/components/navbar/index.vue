<template>
  <nav class="composer-navbar" role="toolbar">
    <ul class="composer-navbar-group" role="menubar">
      <li class="decorative" style="font-weight: bold;" role="menuitem">
        <label>Fastcomposer</label>
      </li>
      <li>
        <label>파일</label>
        <composer-dropdown>
          <li>
            <label> 테스트 </label>
          </li>
          <li>
            <label> 테스트 2 </label>
          </li>
          <li class="enabled">
            <label> 테스트 3 </label>
          </li>
          <li>
            <label> 테스트 4 </label>
            <composer-dropdown opened direction="right">
              <li>
                <label> 테스트 </label>
              </li>
            </composer-dropdown>
          </li>
        </composer-dropdown>
      </li>
    </ul>
    <ul class="composer-navbar-group">
      <li>
        <label> asdf </label>
      </li>
    </ul>
  </nav>
</template>

<script>

import ComposerDropdown from '../dropdown/index.vue'

export default {
  components: {
    ComposerDropdown
  }
}

</script>

<style lang="sass">

.composer-navbar
  @include visual-box-flat
  position: fixed
  top: 0

  display: flex
  align-items: stretch
  justify-content: space-between

  margin: 0
  padding: 0 $dropdown-horizontal-padding

  width: 100%
  height: var(--c-navbar-size)

  line-height: var(--c-navbar-size)

  user-select: none

.composer-navbar-group
  display: flex
  align-items: stretch

  padding: 0

  list-style: none

  > li
    position: relative

    > label
      display: inline-block

      margin: 0
      padding: 0 0.5rem
      list-style: none

    &:not(.decorative) > label
      @include clickable

      padding: 0 $dropdown-horizontal-padding + 1rem 0 $dropdown-horizontal-padding

      @include background-image-icon(20, 16, 'M2,7l3,3l3,-3')
      background-position: right center

</style>
