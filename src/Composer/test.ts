import Actions from './Actions'

import Act from './Act'
import State from './State'
import Layout from './Layout'

const dummyLayouts = new Map(Object.entries({
  'text': Layout.fromDefinition(<Layout>{
    id: 'text',
    description: 'test text',
    params: [
      {
        name: 'title',
        type: 'text',
        description: 'asdf'
      }
    ]
  }),
  'asdf': Layout.fromDefinition(<Layout>{
    id: 'text',
    description: 'test text',
    params: [
      {
        name: 'title',
        type: 'text',
        description: 'asdf'
      }
    ]
  })
}))

const state = new State(dummyLayouts, Actions)

state.perform(new Act('layer.new', undefined, 'asdf'))
console.log('state: ', state.state)
console.log('history: ', state._history)
state.undo()
console.log(state.state)
state.redo()
console.log(state.state)