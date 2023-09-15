import type Action from '../../state/action'
import type Page from '..'

export default <Action<Page>>{
  id: 'layer.hide',
  perform(root, self, act) {
    const path = act.target!
    const arg = act.arg

    const layer = self.getLayerByPath(path)
    if(!layer)
      throw new ReferenceError('attempted to edit nonexistent layer')

    if(!act.remembered)
      act.remember(layer.meta.hidden)

    layer.meta.hidden = !(act.capturedState ?? layer.meta.hidden)

    return act
  },
  rollback(root, self, rememberedAct) {
    rememberedAct.seal()
    console.log(rememberedAct.capturedState)
    const layer = self.getLayerByPath(rememberedAct.target!)!
    layer.meta.hidden = rememberedAct.capturedState
  }
}
