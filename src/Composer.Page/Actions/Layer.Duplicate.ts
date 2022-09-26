import type Action from '../../Composer/IAction'
import type Page from '..'

export default <Action<Page>>{
  id: 'layer.duplicate',
  perform(root, self, act) {
    const target = act.target!
    const newLayer = self.duplicateLayer(target, act.destination?.layer)
    return act.remember(null, newLayer.path)
  },
  rollback(root, self, { destination }) {
    self.removeLayer(destination!)
  }
}
