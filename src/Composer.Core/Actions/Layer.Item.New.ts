import type Action from './IAction'

import Path from '../Path'

export default <Action>{
  id: 'layer.item.new',
  perform(self, act) {
    const path = act.target!

    const layer = self.getLayerByPath(path)
    if(!layer)
      throw new ReferenceError('attempted to edit nonexistent layer')

    layer.addItem(path)

    return act.remember(null, new Path(path.layer, path.child, layer.get(path).length - 1))
  },
  rollback(self, rememberedAct) {
    const path = rememberedAct.destination

    const layer = self.getLayerByPath(path)
    if(!layer)
      throw new ReferenceError('layer or path to rollback couldn\'t be found')

    layer.removeItem(path)
  }
}
