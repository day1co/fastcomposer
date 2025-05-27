<template>
  <section class="fcc-editor__duration fcc-edit-row">
    <label class="fcc-edit-row-label--text label">
      <strong class="name"> 표시 기간 </strong>
      <small class="type">
        {{ durationStatus }}
      </small>

      <tooltip message="
        <b>- 일부 사이트에서만 사용할 수 있습니다!!!</b><br />
        - 둘 중 하나만 지정해도 됩니다.<br />
        <b>- 시작보다 종료가 늦으면 기능이 반대로 작동할 수 있습니다!!</b> (두 시각 사이에만 안 보임)<br />
        - 제대로 입력되면 '시각 설정됨'이 표시됩니다. 꼭 확인해주세요.<br />
        - 오전 12시가 밤, 오후 12시가 낮입니다. (추후 개선 예정)"
      />
    </label>
    <div class="fcc-editor__duration-wrap fcc-edit-input">
      <input
        type="datetime-local"
        v-model="visibleSince"
        :key="layer.path.toString() + '#visibleSince'" />
      <input
        type="datetime-local"
        v-model="visibleUntil"
        :key="layer.path.toString() + '#visibleUntil'" />
    </div>
  </section>
</template>


<script>
import Tooltip from '../components/tooltip.vue';
import { FocusLoop } from '@vue-a11y/focus-loop'

import State, { Act } from '@day1co/fastcomposer-state'

import LayoutInfo from '../components/layout-info.vue';
import Edit from '../components/edit/index.vue'

const mapVisibleMeta = key => ({
  [key]: {
    get() {
      return this.layer.meta?.[key]
    },
    set(v) {
      const act = new Act('layer.edit.meta', this.layer.path, [key, v || null])
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
    state: State
  },
  computed: {
    durationStatus() {
      const since = +new Date(this.visibleSince)
      const until = +new Date(this.visibleUntil)
      if(since)
        if(until)
          if(since > until)
            return '시작-종료 뒤집힘'
          else if(since === until)
            return '시작-종료가 같음'
          else
            return '시작-종료 시각 설정됨'
        else
          return '시작 시각 설정됨'
      else if(until)
        return '종료 시각 설정됨'
      else
        return '설정되지 않음'
    },
    ...mapVisibleMeta('visibleSince'),
    ...mapVisibleMeta('visibleUntil')
  }
}

</script>
