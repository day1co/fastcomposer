import describeAction from './describeAction'
import * as setup from '../setup'

describeAction('layer.new', helpers => {

  it('should work: do, undo, redo', () => {
    const state = helpers.createState()
    const act = helpers.createAct(null, setup.MinimalLayout.id)

    helpers.mocked.uniqueId.mockReturnValueOnce('a')
    
    state.perform(act)
    
    expect(state._state.length).toEqual(1)
    expect(state._state[0].id).toBe('a')

    // undo
    
    state.undo()
    expect(state._state.length).toEqual(0)

    // redo

    state.redo()
    expect(state._state.length).toEqual(1)
    expect(state._state[0].id).toBe('a')
  })

})
