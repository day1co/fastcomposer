import describeAction from './describeAction'
import * as setup from '../setup'

describeAction('layer.remove', ['layer.new'], helpers => {

  it('should work: do, undo', () => {
    const state = helpers.createState()


    let actNew = helpers.createAct('layer.new', null, setup.MinimalLayout.id)
    helpers.mocked.uniqueId.mockReturnValueOnce('a')
    actNew = state.perform(actNew)
    expect(actNew.destination.layer).toBe('a')

    let act = helpers.createAct(actNew.destination)
    act = state.perform(act)
    expect(state._state.length).toEqual(0)

    // undo

    state.undo()

    expect(state._state.length).toEqual(1)
    expect(state._state[0].id).toBe('a')
  })

})
