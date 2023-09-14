import Layer from '../../../page/layer'
import Path from '../../../page/path'

export default {
  inject: ['state'],
  provide() {
    return { state: this.state }
  },
  props: {
    path: Path,
    param: {
      type: Object,
      required: true,
      default() { return {} }
    },
    layer: Layer
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
