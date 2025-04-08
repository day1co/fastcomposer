import type Action from '../../state/action'
import type Page from '..'
import type Path from '../path'
import type { LayerMeta } from '../layer'

import icon from './icons/Layer.Edit.svg?raw'

export default <Action<Page, Path>>{
  id: 'layer.edit.meta',
  title: '레이어 속성 수정',
  icon,
  perform(root, self, act) {
    const path = act.target
    const [key, value] = act.arg as [keyof LayerMeta, string]
    if(key == null || value == null)
      throw new TypeError('invalid arg on Layer.Edit.Meta')

    const layer = self.getLayerByPath(path)
    if(!layer)
      throw new ReferenceError('attempted to edit meta of nonexistent layer')

    act.remember(layer.meta[key])
    if(act.remembered)
      self.setFocus(path)

    layer.setMeta(key, value)

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
    const [key, value] = rememberedAct.capturedState as [keyof LayerMeta, string]

    const layer = self.getLayerByPath(path)
    if(!layer)
      throw new ReferenceError('layer or path to rollback couldn\'t be found…maybe time paradox?')

    self.setFocus(path)
    layer.setMeta(key, value)
  }
}
