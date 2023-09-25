import type Action from '../../state/action'
import type Page from '..'

export default <Action<Page>>{
  id: 'layer.new',
  title: '새 레이어',
  perform(root, self, act) {
    const { target, arg, destination } = act
    const newLayer = self.appendLayer(target, arg, destination?.layer)

    return act.remember(null, newLayer.path)
  },
  rollback(root, self, { destination }) {
    self.removeLayer(destination!)
  }
}
