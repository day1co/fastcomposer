import type Action from '../../state/action'
import type Page from '..'
import type Path from '../path'

import icon from './icons/Layer.Edit.svg?raw'

export default <Action<Page, Path>>{
  id: 'layer.edit',
  title: '레이어 값 수정',
  icon,
  perform(root, self, act) {
    const path = act.target
    const value = act.arg!

    const layer = self.getLayerByPath(path)
    if(!layer)
      throw new ReferenceError('attempted to edit nonexistent layer')

    act.remember(layer.get(path))
    if(act.remembered)
      self.setFocus(path)

    layer.set(path, value)

    return act
  },
  compose(root, self, previousAct, act) {
    previousAct.update(act.arg)
    if(previousAct.arg === previousAct.capturedState)
      return null

    return previousAct
  },
  rollback(root, self, rememberedAct) {
    rememberedAct.seal()
    const path = rememberedAct.target!
    const value = rememberedAct.capturedState

    const layer = self.getLayerByPath(path)
    if(!layer)
      throw new ReferenceError('layer or path to rollback couldn\'t be found…maybe time paradox?')

    self.setFocus(path)
    layer.set(path, value)
  }
}
