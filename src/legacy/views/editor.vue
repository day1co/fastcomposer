<template>
  <div class="fcc-editor">
    <layout-info :layout="layer.layout" />

    <focus-loop is-visible>
      <edit :layer="layer" />
    </focus-loop>
  </div>
</template>

<script>
import { FocusLoop } from '@vue-a11y/focus-loop'

import Page from '@day1co/fastcomposer-page'
import State from '@day1co/fastcomposer-state'

import EventBus from '../event-bus.vue';
import LayoutInfo from '../components/layout-info.vue';
import Edit from '../components/edit/index.vue'

export default {
  components: {
    FocusLoop,
    LayoutInfo,
    Edit
  },
  props: {
    layer: {
      type: Object,
      default() {
        return {};
      },
    },
    page: Page,
    state: State
  },
  provide() {
    return {
      state: this.state
    }
  },
  data() {
    return {
      accept: {
        image: 'image/*',
        video: 'video/mp4',
      },
    };
  },
  mounted() {
    EventBus.$on('focus-editor', () => this.focus());
  },
  methods: {
    onUpload(name, url) {
      this.layer.values[name] = url;
    },
    focus(path = null) {
      this.$nextTick(() => {
        const targetId = path?.toString()
        if(targetId) {
          document.getElementById(targetId)?.scrollIntoView()
          document.getElementById(targetId)?.focus()
          return
        }

        this.$el.scrollTop = 0
        this.$el.parentElement.scrollTop = 0

        this.$el.querySelector('input,textarea,select,button')?.focus()
      })
    }
  },
  watch: {
    ['page.focus'](to) {
      if(to?.child)
        this.focus(to)
    }
  }
}

</script>

<style lang="scss">
@import '../assets/scss/utils/utilities';
.fcc-editor {
  position: relative;
  padding: 0.8rem;
  min-height: 100%;

  background: $secondary;

  > .fcc-layout-info  {
    margin-bottom: 0.8rem;
  }
  &__edit {
    /*display: none;*/
    position: relative;
    margin: 0 1.8rem 1.2rem;
  }
}
</style>
