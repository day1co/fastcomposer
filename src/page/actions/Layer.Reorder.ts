import type Action from '../../state/action'
import type Page from '..'
import type Path from '../path'
import { Paths } from '../path'


export default <Action<Page, Path | Paths>>{
  id: 'layer.reorder',
  title: '레이어 순서 변경',
  perform(root, self, act) {
    const targetLabel = self.describe(act.target)

    let [ from, to ] =
      act.target.type === 'paths'
    ? self.reorderMultipleLayers(act.target.paths, act.arg)
    : self.reorderLayer(act.target, act.arg)
    // store as indexes
    // better to have destination but...
    // in self case, target just moved without changes on Path itself
    // will editor focus it again? I hope so...

    if(!act.remembered)
      act.meta = targetLabel + ' → #' + to

    if(act.target.type === 'paths') {
      self.setFocus(act.target.paths[0])
      if(act.remembered)
        from = (<Array<any>>from).map(([ from, to ], index) => [act.capturedState.from[index][0], to])

      return act.remember({ from, to })
    } else {
      self.setFocus(act.target)
      return act.remember({ from, to })
    }
  },
  rollback(root, self, { target, capturedState }) {
    const { from, to } = capturedState
    if(target.type === 'paths') {
      self.restoreMultipleLayers(from)
    } else {
      self.setFocus(target)
      self.reorderLayer(to, from)
    }
  },
  compose(root, self, previousAct, act) {
    if(previousAct.target.type === 'paths' || act.target.type === 'paths') {
      const pre = previousAct.capturedState.from
      const post = act.capturedState.from
      if(pre.length !== post.length) return
      for(let i = 0; i < pre.length; i++) {
        if(pre[i][1] !== post[i][0])
          return
      }
      previousAct.capturedState.from = pre.map(([ from, to ], index) => [ from, post[index][1] ])
      previousAct.capturedState.to = act.capturedState.from
      return previousAct
    }
  }
}
