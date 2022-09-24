import type Action from './IAction'

export default <Action>{
  id: 'layer.reorder',
    perform(self, act) {
    const [from, to] = self.reorderLayer(act.target!, act.arg)
    // store as indexes
    // better to have destination but...
    // in self case, target just moved without changes on Path itself
    // will editor focus it again? I hope so...
    return act.remember({ from, to })
  },
  rollback(self, { capturedState }) {
    const { from, to } = capturedState
    self.reorderLayer(from, to)
  }
}