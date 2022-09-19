import describeAction from './describeAction'
import * as setup from '../setup'

describeAction('layer.remove', ['layer.new'], helpers => {

  it('should work: do, undo', () => {
    const state = helpers.createState()

    let actNew = helpers.createAct('layer.new', null, setup.MinimalLayout.id)
    helpers.mocked.uniqueId.mockReturnValueOnce('a')
    actNew = state.perform(actNew)
    expect(actNew.destination.layer).toBe('a')

    helpers.checkTimeParadox(state, {
      before() {
        expect(state._state.length).toEqual(1)
        expect(state._state[0].id).toBe('a')
      },
      act: helpers.createAct(actNew.destination),
      after() {
        expect(state._state.length).toEqual(0)
      }
    })
  })

})
