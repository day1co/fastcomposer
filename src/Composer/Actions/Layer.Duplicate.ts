import type Action from './IAction'
import type State from '../State'
import type Act from '../Act'

export default <Action>{
  id: 'layer.duplicate',
  perform(self, act) {
    const target = act.target!
    const newLayer = self.duplicateLayer(target, act.destination?.layer)
    return act.remember(null, newLayer.path)
  },
  rollback(self, { destination }) {
    self.removeLayer(destination!)
  }
}
