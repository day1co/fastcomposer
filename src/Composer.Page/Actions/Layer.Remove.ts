import type Action from '../../Composer/IAction'
import type Page from '..'

import Path from '../Path'

export default <Action<Page>>{
  id: 'layer.remove',
  perform(root, self, act) {
    const target = act.target!

    const oldLayer = self.getLayerByPath(target)
    if(!oldLayer)
      throw new Error(`layer requested to removal couldn't be found (${target.toString()})`)

    const removedIndex = self.removeLayer(target) ?? 0
    let moveFocusTo: Path | undefined
    if(self.state.length > removedIndex)
      moveFocusTo = self.state[removedIndex - 1]?.path

    return act.remember({ layer: oldLayer }, moveFocusTo)
  },
  rollback(root, self, { destination, capturedState }) {
    // XXX does it really work?
    self.restoreLayer(destination!, capturedState.layer)
  }
}