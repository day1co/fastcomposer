import Path from '../../../page/path'

export default {
  inject: ['state'],
  props: {
    path: Path,
    param: {
      type: Object,
      required: true,
      default() { return {} }
    },
    value: {
      type: undefined
    }
  },
  computed: {
    inputId() {
      return this.path.toString()
    },
    mappedValue: {
      get() { return this.value },
      set(v) { this.state.act('layer.edit', this.path, v) }
    }
  }
}
