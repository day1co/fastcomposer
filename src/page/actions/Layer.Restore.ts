import type Action from '../../state/action'
import type Act from '../../state/act'
import type Page from '../page'
import type Path from '../path'
import type Snippets from '../../layout/structs/Snippet'

import { Paths } from '../path'

import icon from './icons/Layer.New.svg?raw'

export default <Action<Page, Path | Paths>>{
  id: 'layer.restore',
  title: '레이어 가져오기',
  icon,
  perform(root, self, act) {
    const target = <Path>act.target
    const destination = <Paths>act.destination

    const { title, layers } = <Snippets>act.arg

    const newPaths: Array<Path> = destination?.paths ?? []

    for(let i = 0; i < layers.length; i++) {
      const layer = layers[i]
      try {
        const lastPath = i === 0? target : newPaths.at(i - 1)
        const rememberedPath = newPaths.at(i) ?? null
        const { path } = self.appendLayer(lastPath, layer.layout, rememberedPath?.layer, layer.values, layer.meta)
        if(!rememberedPath)
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
    self.setFocus(rememberedAct.target)
  }
}
