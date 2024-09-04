import type Action from '@day1co/fastcomposer-state/action'
import type Page from '../page'

import Path from '../path'

import icon from './icons/Layer.Item.New.svg?raw'

export default <Action<Page, Path>>{
  id: 'layer.item.new',
  title: '레이어의 리스트 항목 추가',
  icon,
  perform(root, self, act) {
    const path = act.target!

    const layer = self.getLayerByPath(path)
    if(!layer)
      throw new ReferenceError('attempted to edit nonexistent layer')

    layer.addItem(path)

    const newPath = new Path(path.layer, path.child, layer.get(path).length - 1)
    if(act.remembered)
      self.setFocus(newPath)

    return act.remember(null, newPath)
  },
  rollback(root, self, rememberedAct) {
    const path = rememberedAct.destination

    const layer = self.getLayerByPath(path)
    if(!layer)
      throw new ReferenceError('layer or path to rollback couldn\'t be found')

    layer.removeItem(path)
  }
}
