import Action from '../Actions/IAction'

import Layout from '../Layout'
import LayoutParameter from '../Structs/LayoutParameter'
import ListLayoutParameter from '../Structs/ListLayoutParameter'

export const MinimalLayoutDefinition = <Layout>{
  id: 'test',
  description: 'test layout type 0',
  params: [
    {
      name: 'text',
      type: 'text',
      description: 'text'
    }
  ]
}

export const MinimalLayout = Layout.fromDefinition(MinimalLayoutDefinition)

export const MinimalLayouts = new Map([
  [ MinimalLayout.id, MinimalLayout ]
])

export const MinimalLayoutsAsObject = {
  [MinimalLayout.id]: MinimalLayout
}

export const ListLayout = Layout.fromDefinition(<Layout>{
  id: 'test',
  description: 'test layout type 1 - includes all possible layout types',
  params: [
    <ListLayoutParameter>{
      name: 'list',
      type: 'list',
      description: 'list',
      maxLength: 3,
      params: [
        {
          name: 'a',
          type: 'string',
          description: 'test',
          params: [
            {
              name: 'b'
            }
          ]
        }
      ]
    }
  ]
})

///

export const NoopAction = <Action>{
  id: 'noop',
  perform(self, act) {
    return act.remember()
  },
  rollback(self, act) { }
}

export const MinimalActions = new Map([
  [ NoopAction.id, NoopAction ]
])