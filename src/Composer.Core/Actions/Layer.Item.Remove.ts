import type Action from './IAction'

import Path from '../Path'

export default <Action>{
  id: 'layer.item.remove',
  perform(self, act) {
    const path = act.target!

    const layer = self.getLayerByPath(path)
    if(!layer)
      throw new ReferenceError('attempted to edit nonexistent layer')

    const oldPayload = layer.get(path.partial('index'))
    layer.removeItem(path)

    return act.remember(oldPayload, path)
  },
  rollback(self, rememberedAct) {
    const path = rememberedAct.destination

    const layer = self.getLayerByPath(path)
    if(!layer)
      throw new ReferenceError('layer or path to rollback couldn\'t be found')

    layer.addItem(path, rememberedAct.capturedState)
  }
}
