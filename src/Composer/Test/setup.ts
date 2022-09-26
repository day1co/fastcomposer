import Action from '../IAction'

import Layout from '../../Composer.Page/Layout'
import Module from '../Module'

export const DEFAULT_VALUE = 'default value'

export const MinimalLayoutDefinition = {
  id: 'test',
  description: 'test layout type 0',
  params: [
    {
      name: 'param1',
      type: 'text',
      description: 'text'
    }
  ],
  values: {
    param1: DEFAULT_VALUE
  }
}

export const MinimalLayout = Layout.fromDefinition(MinimalLayoutDefinition)

export const MinimalLayouts = new Map([
  [ MinimalLayout.id, MinimalLayout ]
])

export const MinimalLayoutsAsObject = {
  [MinimalLayout.id]: MinimalLayout
}

///

export const DEFAULT_LIST_VALUE = 'default list value'

export const ListLayout = Layout.fromDefinition({
  id: 'test',
  description: 'test layout type 1 - includes all possible layout types',
  params: [
    {
      name: 'list',
      type: 'list',
      description: 'list',
      maxLength: 3,
      params: [
        {
          name: 'param1',
          type: 'string',
          description: 'test',
          defaultValue: DEFAULT_LIST_VALUE
        }
      ]
    }
  ],
  values: {
    list: []
  }
})

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
