import type Action from '../../state/action'
import type Page from '..'
import type Path from '../path'

import { Paths } from '../path'

import icon from './icons/Layer.Reorder.svg?raw'

export default <Action<Page, Path | Paths>>{
  id: 'layer.reorder',
  title: '레이어 순서 변경',
  icon,
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

    act.meta = targetLabel + ' → #' + to

    if(act.target.type === 'paths') {
      self.setFocus(act.target.paths[0])
      if(act.remembered)
        from = (<Array<any>>from).map(([ from, to ], index) => [act.capturedState.from[index][0], to])

      act.remember({ from, to })
      act.seal()
      return act
    } else {
      self.setFocus(act.target)
      return act.remember({ from, to })
    }
  },
  compose(root, self, previousAct, act) {
    console.log(previousAct.target.type, act.target.type)
    if(previousAct.target.type === 'paths' && act.target.type === 'paths') {
      const pre = previousAct.capturedState.from
      const post = act.capturedState.from
      console.log(pre, post)
      if(pre.length !== post.length) return
      for(let i = 0; i < pre.length; i++) {
        if(pre[i][1] !== post[i][0])
          return true
      }
      previousAct.capturedState.from = pre.map(([ from, to ], index) => [ from, post[index][1] ])
      previousAct.capturedState.to = act.capturedState.from
      return previousAct
    }
    return true
  },
  rollback(root, self, { target, capturedState }) {
    const { from, to } = capturedState
    if(target.type === 'paths') {
      console.log('restore history based on:', from)
      self.restoreMultipleLayers(from)
    } else {
      self.setFocus(target)
      self.reorderLayer(to, from)
    }
  }
}
