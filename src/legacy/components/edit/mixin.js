import Path from '../../../page/path'

export default {
  inject: ['state', 'layer'],
  provide() {
    return {
      state: this.state,
      layer: this.layer
    }
  },
  props: {
    path: Path,
    param: {
      type: Object,
      required: true,
      default() { return {} }
    }
  },
  computed: {
    inputId() {
      return this.path.toString()
    },
    value: {
      get() { return this.layer.get(this.path) },
      set(v) { this.state.act('layer.edit', this.path, v) }
    }
  }
}
