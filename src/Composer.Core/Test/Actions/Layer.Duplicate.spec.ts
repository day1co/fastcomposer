import describeAction from './describeAction'
import * as setup from '../setup'

describeAction('layer.duplicate', ['layer.new'], helpers => {

  it('should work: do, undo, redo', () => {
    const state = helpers.createState()

    helpers.mocked.uniqueId
      .mockReturnValueOnce('a')
      .mockReturnValueOnce('b')

    let actNew = helpers.createAct('layer.new', null, setup.MinimalLayout.id)
    actNew = state.perform(actNew)
    expect(actNew.destination.layer).toBe('a')

    let act = helpers.createAct(actNew.destination)
    act = state.perform(act)
    expect(state._state.length).toEqual(2)
    expect(act.destination.layer).toBe('b')
    // assert that duplicated layer to be placed AFTER of original
    expect(state._state[1].id).toBe('b')

    // undo

    state.undo()
    expect(state._state.length).toEqual(1)

    // redo

    state.redo()
    expect(state._state.length).toEqual(2)
    expect(state._state[0].id).toBe('a')
    expect(state._state[1].id).toBe('b')
  })

  // it('should clone() to cut reference of its value', () => {})
})