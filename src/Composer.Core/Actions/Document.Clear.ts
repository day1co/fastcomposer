import type Action from './IAction'
import type State from '../State'
import type Act from '../Act'

export default <Action>{
  id: 'document.clear',
  perform(this: State, act: Act) {
    const target = act.target!
    const newLayer = this.duplicateLayer(target, act.destination?.layer)
    return act.remember(null, newLayer.path)
  },
  undo(this: State, { destination }: Act) {
    this.removeLayer(destination!)
  }
}