import Action from '../action'
import Module from '../module'

///

export const NoopAction = <Action<NoopModule>>{
  id: 'noop',
  perform(root, self, act) {
    return act.remember()
  },
  rollback(root, self, act) { }
}

export class NoopModule extends Module {
  actions: Map<string, Action<NoopModule>> = new Map([
    [ 'noop', NoopAction ]
  ])

  constructor() {
    super(MinimalActions)
  }
}


export const MinimalActions = new Map([
  [ NoopAction.id, NoopAction ]
])
