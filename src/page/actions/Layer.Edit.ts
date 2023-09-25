import type Action from '../../state/action'
import type Page from '..'

export default <Action<Page>>{
  id: 'layer.edit',
  title: '레이어 값 수정',
  label(root, self, act) {
    const path = act.target
    const layout = self.getLayerByPath(path).layout
    if(!layout) return

    const child = layout.params.get(path.child)
    const grandchild = layout.getListParams(path.child)?.get(path.grandchild)

    if(!grandchild)
      return `${layout.id} ${child.label ?? child.name}`
    else
      return `${layout.id} ${child.label ?? child.name} #${path.index + 1} ${grandchild.label ?? grandchild.name}`
  },
  perform(root, self, act) {
    const path = act.target!
    const value = act.arg!

    const layer = self.getLayerByPath(path)
    if(!layer)
      throw new ReferenceError('attempted to edit nonexistent layer')

    if(!act.remembered)
      act.remember(layer.get(path))

    layer.set(path, value)
    return act
  },
  compose(root, self, previousAct, act) {
    previousAct.update(act.arg)
    if(previousAct.arg === previousAct.capturedState)
      return null

    return previousAct
  },
  rollback(root, self, rememberedAct) {
    rememberedAct.seal()
    const path = rememberedAct.target!
    const value = rememberedAct.capturedState

    const layer = self.getLayerByPath(path)
    if(!layer)
      throw new ReferenceError('layer or path to rollback couldn\'t be found…maybe time paradox?')

    layer.set(path, value)
  }
}
