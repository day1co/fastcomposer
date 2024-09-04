import type Action from '@day1co/fastcomposer-state/action'
import type Page from '../page'
import type Path from '../path'

import icon from './icons/Layer.Duplicate.svg?raw'

export default <Action<Page, Path>>{
  id: 'layer.duplicate',
  title: '레이어 중복',
  icon: icon,
  perform(root, self, act) {
    const target = act.target
    const newLayer = self.duplicateLayer(target, act.destination?.layer)

    self.setFocus(newLayer.path)
    return act.remember(null, newLayer.path)
  },
  rollback(root, self, rememberedAct) {
    self.setFocus(rememberedAct.target)
    self.removeLayer(rememberedAct.destination!)
  }
}
