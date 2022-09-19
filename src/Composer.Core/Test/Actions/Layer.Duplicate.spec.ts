import describeAction from './describeAction'
import * as setup from '../setup'
import Path from '../../Path'

describeAction('layer.duplicate', ['layer.new'], helpers => {

  it('should work: do, undo, redo', () => {
    const state = helpers.createState()

    let actNew = helpers.createAct('layer.new', null, setup.MinimalLayout.id)
    actNew.remember(null, new Path('a'))
    actNew = state.perform(actNew)

    expect(actNew.destination.layer).toBe('a')

    helpers.checkTimeParadox(state, {
      before() {
        expect(state._state.length).toEqual(1)
        expect(state._state[0].id).toBe('a')
      },
      act() {
        const act = helpers.createAct(actNew.destination)
        helpers.mocked.uniqueId.mockReturnValueOnce('b')
        return act
      },
      after() {
        expect(state._state.length).toEqual(2)
        expect(state._state[0].id).toBe('a')
        expect(state._state[1].id).toBe('b')
      }
    })
  })

  // it('should clone() to cut reference of its value', () => {})
})
