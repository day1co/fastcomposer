import type Action from '../../state/action'
import type Page from '..'

export default <Action<Page>>{
  id: 'layer.item.remove',
  title: '레이어의 리스트 항목 제거',
  perform(root, self, act) {
    const path = act.target!

    const layer = self.getLayerByPath(path)
    if(!layer)
      throw new ReferenceError('attempted to edit nonexistent layer')

    const oldPayload = layer.get(path.partial('index'))
    layer.removeItem(path)
    self.setFocus()

    return act.remember(oldPayload, path)
  },
  rollback(root, self, rememberedAct) {
    const path = rememberedAct.destination

    const layer = self.getLayerByPath(path)
    if(!layer)
      throw new ReferenceError('layer or path to rollback couldn\'t be found')

    self.setFocus(path)
    layer.addItem(path, rememberedAct.capturedState)
  }
}
