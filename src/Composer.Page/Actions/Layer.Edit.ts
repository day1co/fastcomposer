import type Action from '../../Composer/IAction'
import type Page from '..'

export default <Action<Page>>{
  id: 'layer.edit',
  perform(root, self, act) {
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
  compose(root, self, previousAct, act) {
    previousAct.update(act.arg)
    return previousAct
  },
  rollback(root, self, rememberedAct) {
    rememberedAct.seal()
    const path = rememberedAct.target
    const value = rememberedAct.capturedState

    const layer = self.getLayerByPath(path)
    if(!layer)
      throw new ReferenceError('layer or path to rollback couldn\'t be found…maybe time paradox?')

    layer.set(path, value)
  }
}
