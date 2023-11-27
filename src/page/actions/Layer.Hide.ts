import type Action from '../../state/action'
import type Page from '..'
import type Path from '../path'

export default <Action<Page, Path>>{
  id: 'layer.hide',
  title: '레이어 숨기기',
  perform(root, self, act) {
    const path = act.target!
    const arg = act.arg

    const layer = self.getLayerByPath(path)
    if(!layer)
      throw new ReferenceError('attempted to edit nonexistent layer')

    act.remember(layer.meta.hidden)
    if(act.remembered)
      self.setFocus(path)

    layer.meta.hidden = !(act.capturedState ?? layer.meta.hidden)

    return act
  },
  rollback(root, self, rememberedAct) {
    rememberedAct.seal()

    self.setFocus(rememberedAct.target)

    const layer = self.getLayerByPath(rememberedAct.target!)!
    layer.meta.hidden = rememberedAct.capturedState
  }
}
