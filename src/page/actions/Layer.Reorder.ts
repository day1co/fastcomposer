import type Action from '../../state/action'
import type Page from '..'

export default <Action<Page>>{
  id: 'layer.reorder',
  title: '레이어 순서 변경',
  perform(root, self, act) {
    const [from, to] = self.reorderLayer(act.target!, act.arg)
    // store as indexes
    // better to have destination but...
    // in self case, target just moved without changes on Path itself
    // will editor focus it again? I hope so...

    act.meta += ' → #' + to
    self.setFocus(act.target)
    return act.remember({ from, to })
  },
  rollback(root, self, { target, capturedState }) {
    const { from, to } = capturedState
    self.setFocus(target)
    self.reorderLayer(to, from)
  }
}
