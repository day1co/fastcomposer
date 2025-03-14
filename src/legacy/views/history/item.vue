<template>
  <li class="fcc-history-item">
    <img
      class="fcc-history-icon fcc--invert-on-dark"
      :src="icon" />
    <label class="fcc-history-label">
      {{ action.title }}
      <small v-if="label">{{ label }}</small>
    </label>
  </li>
</template>

<script>
import Act from '../../../state/act'

export default {
  props: {
    history: Act
  },
  inject: ['state'],
  computed: {
    action() {
      return this.state.resolveAction(this.history.action)[1]
    },
    icon() {
      const icon = this.action?.icon ?? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="m1 1v22h22V1zm0 0l22 22" fill="none" stroke="#888" stroke-width="2" /></svg>'
      return 'data:image/svg+xml;utf8,' + encodeURIComponent(icon)
    },
    label() {
      return this.history?.meta
    }
  }
}

</script>

<style lang="scss">

@import '../../assets/scss/utils/utilities';

.fcc-history-item {
  background: $primary;
  line-height: 2.4rem;
  padding: 0.2rem;

  .fcc-history-icon {
    width: 2.4rem;
    height: 2.4rem;
    vertical-align: top;
  }
  &.current {
    box-shadow: 0 0 0 0.2rem $foreground;
  }
  &.future {
    opacity: 0.5;
  }
}

</style>
