import type Action from '@day1co/fastcomposer-state/action'
import type Page from '../page'
import type Path from '../path'

import { Paths } from '../path'

import icon from './icons/Layer.Remove.svg?raw'

export default <Action<Page, Path | Paths>>{
  id: 'layer.remove',
  title: '레이어 삭제',
  icon,
  perform(root, self, act) {
    const path = act.target
    const paths = path.type === 'path' ? [path] : path.paths

    const sortedPaths = [...paths].sort((a, b) => {
      const indexA = self.pathToIndex(a) ?? 0
      const indexB = self.pathToIndex(b) ?? 0
      return indexB - indexA
    })

    const removedLayers = []
    const pathsBeforeRemoved = []

    act.meta = self.describe(path)

    for (const path of sortedPaths) {
      const oldLayer = self.getLayerByPath(path)
      if (!oldLayer)
        throw new Error(`layer requested to removal couldn't be found (${path.toString()})`)

      const removedIndex = self.removeLayer(path) ?? 0
      const pathBeforeRemoved = self.indexToPath(removedIndex)

      removedLayers.push(oldLayer)
      pathsBeforeRemoved.push(pathBeforeRemoved)
    }

    self.setFocus()

    return act.remember({
      layers: removedLayers,
      positions: pathsBeforeRemoved
    }, path.type === 'path' ? paths[0] : new Paths(paths))
  },
  rollback(root, self, { target, destination, capturedState }) {
    const { layers, positions } = capturedState

    for (let i = layers.length - 1; i >= 0; i--) {
      self.restoreLayer(positions[i], layers[i])
    }

    self.setFocus(target)
  }
}
