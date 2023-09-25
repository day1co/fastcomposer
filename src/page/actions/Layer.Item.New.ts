import type Action from '../../state/action'
import type Page from '..'

import Path from '../path'

export default <Action<Page>>{
  id: 'layer.item.new',
  title: '레이어의 리스트 항목 추가',
  perform(root, self, act) {
    const path = act.target!

    const layer = self.getLayerByPath(path)
    if(!layer)
      throw new ReferenceError('attempted to edit nonexistent layer')

    layer.addItem(path)

    return act.remember(null, new Path(path.layer, path.child, layer.get(path).length - 1))
  },
  rollback(root, self, rememberedAct) {
    const path = rememberedAct.destination

    const layer = self.getLayerByPath(path)
    if(!layer)
      throw new ReferenceError('layer or path to rollback couldn\'t be found')

    layer.removeItem(path)
  }
}
