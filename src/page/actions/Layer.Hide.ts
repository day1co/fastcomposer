import type Action from '../../state/action'
import type Page from '..'
import type Path from '../path'
import type { Paths } from '../path'

import icon from './icons/Layer.Hide.svg?raw'

export default <Action<Page, Path | Paths>>{
  id: 'layer.hide',
  title: '레이어 숨기기',
  icon,
  perform(root, self, act) {
    const path = act.target
    const paths = path.type === 'path'? [path] : path.paths

    const layers = paths.map(path => {
      const layer = self.getLayerByPath(path)
      if(!layer)
        throw new ReferenceError('attempted to edit nonexistent layer')
      return layer
    })
    const oldStates = layers.map(layer => layer.meta.hidden)

    for(const layer of layers) {

      if(!layer)
        throw new ReferenceError('attempted to edit nonexistent layer')

      layer.meta.hidden = !(act.capturedState ?? layer.meta.hidden)
    }

    if(act.remembered)
      self.setFocus(path)

    act.remember(oldStates)

    return act
  },
  rollback(root, self, rememberedAct) {
    rememberedAct.seal()

    self.setFocus(rememberedAct.target)
    const path = rememberedAct.target
    const paths = path.type === 'path'? [path] : path.paths
    const oldStates = rememberedAct.capturedState

    for(const index in paths) {
      const path = paths[index]
      const layer = self.getLayerByPath(path)
      layer.meta.hidden = oldStates[index]
    }
  }
}
