import describeAction from './describe-action'
import * as setup from '../setup'

describeAction('layer.reorder', ['layer.new'], helpers => {

  it('should work: do, undo, redo', () => {
    const [ page, state ] = helpers.createState()

    const actA = helpers.createAct('layer.new', null, setup.MinimalLayout.id)
    helpers.mocked.uniqueId.mockReturnValueOnce('a')
    state.perform(actA)

    const actB = helpers.createAct('layer.new', null, setup.MinimalLayout.id)
    helpers.mocked.uniqueId.mockReturnValueOnce('b')
    state.perform(actB)

    const actC = helpers.createAct('layer.new', null, setup.MinimalLayout.id)
    helpers.mocked.uniqueId.mockReturnValueOnce('c')
    state.perform(actC)

    helpers.checkTimeParadox(state, {
      before() {
        expect(page.state.map(layer => layer.id)).toEqual([ 'a', 'b', 'c' ])
      },
      act: helpers.createAct(actA.destination, actB.destination),
      after() {
        expect(page.state.map(layer => layer.id)).toEqual([ 'b', 'a', 'c' ])
      }
    })
  })

})
