import type Action from './IAction'
import Path from '../Path'

export default <Action>{
  id: 'layer.remove',
  perform(self, act) {
    const target = act.target!

    const oldLayer = self.getLayerByPath(target)
    if(!oldLayer)
      throw new Error(`layer requested to removal couldn't be found (${target.toString()})`)

    const removedIndex = self.removeLayer(target) ?? 0
    let moveFocusTo: Path | undefined
    if(self._state.length > removedIndex)
      moveFocusTo = self._state[removedIndex - 1]?.path

    return act.remember({ layer: oldLayer }, moveFocusTo)
  },
  rollback(self, { destination, capturedState }) {
    // XXX does it really work?
    self.restoreLayer(destination!, capturedState.layer)
  }
}
