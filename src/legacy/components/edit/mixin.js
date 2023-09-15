import Layer from '../../../page/layer'
import Path from '../../../page/path'
import Act from '../../../state/act'

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
  data: () => ({
    // shouldNotCompose: false
  }),
  computed: {
    inputId() {
      return this.path.toString()
    },
    value: {
      get() { return this.layer.get(this.path) },
      set(v) {
        const act = new Act('layer.edit', this.path, v)
        this.state.perform(act, null, this.shouldNotCompose)
      }
    }
  }
}
