import type Action from '@day1co/fastcomposer-state/action'
import type Page from '../page'
import type Path from '../path'

import icon from './icons/Layer.New.svg?raw'

export default <Action<Page, Path>>{
  id: 'layer.new',
  title: '새 레이어',
  icon,
  perform(root, self, act) {
    const { target, arg, destination } = act
    const newLayer = self.appendLayer(target, arg, destination?.layer)

    self.setFocus(newLayer.path)

    act.meta = self.describe(newLayer.path)
    return act.remember(null, newLayer.path)
  },
  rollback(root, self, { destination }) {
    self.removeLayer(destination!)
  }
}
