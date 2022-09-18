import type Action from './IAction'
import type State from '../State'
import type Act from '../Act'

export default <Action>{
  id: 'layer.edit',
  perform(self, act) {
    const path = act.target!
    const value = act.arg!

    const layer = self.getLayerByPath(path)
    if(!layer)
      throw new ReferenceError('attempted to edit nonexistent layer')

    if(!act.remembered)
      act.remember(layer.get(path))

    layer.set(path, value)
    return act
  },
  compose(self, previousAct, act) {
    if(!previousAct.isComposableWith(act))
      return false

    previousAct.update(act.arg)
    return previousAct
  },
  rollback(self, rememberedAct) {
    rememberedAct.seal()
    const oldPayload = rememberedAct.capturedState
  }
}
