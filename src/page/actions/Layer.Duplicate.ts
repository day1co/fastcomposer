import type Action from '../../state/action'
import type Page from '..'

export default <Action<Page>>{
  id: 'layer.duplicate',
  title: '레이어 중복',
  perform(root, self, act) {
    const target = act.target!
    const newLayer = self.duplicateLayer(target, act.destination?.layer)
    return act.remember(null, newLayer.path)
  },
  rollback(root, self, { destination }) {
    self.removeLayer(destination!)
  }
}
