import type Action from '../../state/action'
import type Page from '..'
import type Path from '../path'

import icon from './icons/Layer.New.svg?raw'

export default <Action<Page, Path>>{
  id: 'layer.restore',
  title: '레이어 가져오기',
  icon,
  perform(root, self, act) {
    const { target, arg: snippet, destination } = act
    const { title, layers } = snippet
    const newPaths = []
    for(const layer of layers) {
      try {
        const lastPath = newPaths.at(-1) || target
        const path = self.appendLayer(lastPath, layer.layout, destination?.layer, layer.values)
        newPaths.push(path)
      } catch(e) {
        console.error(e)
      }
    }

    const lastLayer = newPaths.at(-1)

    self.setFocus(lastLayer.path)

    act.meta = title + ' → ' + self.describe(target)
    return act.remember(null, lastLayer.path)
  },
  rollback(root, self, { destination }) {
    self.removeLayer(destination!)
  }
}
