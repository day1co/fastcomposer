import type Action from '../../state/action'
import type Page from '..'

import Path from '../path'

export default <Action<Page>>{
  id: 'layer.remove',
  title: '레이어 삭제',
  perform(root, self, act) {
    const path = act.target!

    const oldLayer = self.getLayerByPath(path)
    if(!oldLayer)
      throw new Error(`layer requested to removal couldn't be found (${path.toString()})`)

    const removedIndex = self.removeLayer(path) ?? 0
    // let moveFocusTo: Path | undefined
    // if(self.state.length > removedIndex)
    //   moveFocusTo = self.state[removedIndex - 1]?.path

    // self.moveFocus(moveFocusTo)
    self.setFocus()
    return act.remember({ layer: oldLayer }, path) // , moveFocusTo)
  },
  rollback(root, self, { destination, capturedState }) {
    // XXX does it really work?
    self.restoreLayer(destination!, capturedState.layer)
  }
}
