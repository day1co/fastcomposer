<template>
  <div class="fcc-editor">
    <layout-info :layout="layer.layout" />

    <focus-loop is-visible>
      <section class="fcc-editor__duration fcc-edit-row">
        <label class="fcc-edit-row-label--text label">
          <strong class="name"> 표시 기간 </strong>
          <small class="type">
            {{ visibleSince?
              (visibleUntil? '시작-종료 시간 설정됨' : '시작 시간 설정됨')
            : (visibleUntil? '종료 시간 설정됨' : '설정되지 않음') }}
          </small>

          <tooltip message="
            <b>일부 사이트에서만 사용할 수 있습니다!!!</b><br />
            둘 중 하나만 지정해도 됩니다.<br />
            오전 12시가 밤, 오후 12시가 낮입니다. (추후 개선하겠습니다)<br />
            제대로 입력되면 '시간 설정됨'이 표시됩니다. 꼭 확인해주세요."
          />
        </label>
        <div class="fcc-editor__duration-wrap fcc-edit-input">
          <input
            type="datetime-local"
            v-model="visibleSince" />
          <input
            type="datetime-local"
            v-model="visibleUntil" />
        </div>
      </section>

      <edit :layer="layer" />
    </focus-loop>
  </div>
</template>

<script>
import Tooltip from '../components/tooltip.vue';
import { FocusLoop } from '@vue-a11y/focus-loop'

import Page from '@day1co/fastcomposer-page'
import State, { Act } from '@day1co/fastcomposer-state'

import EventBus from '../event-bus.vue';
import LayoutInfo from '../components/layout-info.vue';
import Edit from '../components/edit/index.vue'

const mapMeta = key => ({
  [key]: {
    get() {
      return this.layer.meta?.[key] ?? ''
    },
    set(v) {
      const act = new Act('layer.edit.meta', this.layer.path, [key, v])
      this.state.perform(act, null)
    }
  }
})

export default {
  components: {
    Tooltip,
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
  computed: {
    ...mapMeta('visibleSince'),
    ...mapMeta('visibleUntil')
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

  &__duration {
    container-type: inline-size;

    &-wrap {
      display: flex;
      flex-wrap: wrap;

      > input {
        display: block;
        letter-spacing: -0.1ex;
        width: unset;
        flex: 1 0 50%;
      }

      @container (min-height: 3rem) {
        > input {
          color: red !important;

          &::after {
            display: block;
            content: attr(data-label);

            line-height: 3.6rem;
            word-break: keep-all;
          }
        }
      }
    }
  }
}
</style>
