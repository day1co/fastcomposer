import type Action from './IAction'
import type State from '../State'
import type Act from '../Act'

export default <Action>{
  id: 'document.clear',
  perform(self: State, act: Act) {
    const target = act.target!
    const newLayer = self.duplicateLayer(target, act.destination?.layer)
    return act.remember(null, newLayer.path)
  },
  rollback(self: State, { destination }: Act) {
    self.removeLayer(destination!)
  }
}