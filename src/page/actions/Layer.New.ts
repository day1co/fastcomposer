import type Action from '../../state/action'
import type Page from '..'
import type Path from '../path'

export default <Action<Page, Path>>{
  id: 'layer.new',
  title: '새 레이어',
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
