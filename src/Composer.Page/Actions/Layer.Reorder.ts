import type Action from '../../Composer/IAction'
import type Page from '..'

export default <Action<Page>>{
  id: 'layer.reorder',
  perform(root, self, act) {
    const [from, to] = self.reorderLayer(act.target!, act.arg)
    // store as indexes
    // better to have destination but...
    // in self case, target just moved without changes on Path itself
    // will editor focus it again? I hope so...
    return act.remember({ from, to })
  },
  rollback(root, self, { capturedState }) {
    const { from, to } = capturedState
    self.reorderLayer(from, to)
  }
}
