import type Action from './IAction'

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
    previousAct.update(act.arg)
    return previousAct
  },
  rollback(self, rememberedAct) {
    rememberedAct.seal()
    const path = rememberedAct.target
    const value = rememberedAct.capturedState

    const layer = self.getLayerByPath(path)
    if(!layer)
      throw new ReferenceError('layer or path to rollback couldn\'t be found…maybe time paradox?')

    layer.set(path, value)
  }
}
