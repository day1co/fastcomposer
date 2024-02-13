import type Action from '../../state/action'
import type Act from '../../state/act'
import type Page from '..'
import type Path from '../path'

import { Paths } from '../path'
import icon from './icons/Layer.New.svg?raw'

export default <Action<Page, Path | Paths>>{
  id: 'layer.restore',
  title: '레이어 가져오기',
  icon,
  perform(root, self, act) {
    const { target, arg: snippet, destination } = <Act<Path>>act
    const { title, layers } = snippet
    const newPaths: Array<Path> = []
    for(const layer of layers) {
      try {
        const lastPath = newPaths.at(-1) || target
        const { path } = self.appendLayer(lastPath, layer.layout, destination?.layer, layer.values)
        newPaths.push(path)
      } catch(e) {
        console.error(e)
      }
    }

    const lastLayer = newPaths.at(-1)

    self.setFocus(lastLayer)

    act.meta = title + ' → ' + self.describe(target)
    return act.remember(null, new Paths(newPaths))
  },
  rollback(root, self, rememberedAct) {
    const { destination } = <Act<Paths>>rememberedAct
    for(const path of destination.paths) {
      self.removeLayer(path)
    }
  }
}
