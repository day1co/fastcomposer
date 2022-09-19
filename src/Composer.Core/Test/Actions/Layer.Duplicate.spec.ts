import describeAction from './describeAction'
import * as setup from '../setup'
import Path from '../../Path'

describeAction('layer.duplicate', ['layer.new'], helpers => {

  it('should work: do, undo, redo', () => {
    const state = helpers.createState()

    let actNew = helpers.createAct('layer.new', null, setup.MinimalLayout.id)
    helpers.mocked.uniqueId.mockReturnValueOnce('a')
    actNew = state.perform(actNew)

    expect(actNew.destination.layer).toBe('a')

    let act = helpers.createAct(actNew.destination)
    helpers.mocked.uniqueId.mockReturnValueOnce('b')
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
