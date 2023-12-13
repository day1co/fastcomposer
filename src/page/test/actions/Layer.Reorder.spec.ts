import describeAction from './describe-action'
import * as setup from '../setup'
import Path from '../../path'

describeAction('layer.reorder', ['layer.new'], helpers => {

  it('should work: do, undo, redo', () => {
    const [ page, state ] = helpers.createState()

    const actA = helpers.createAct('layer.new', null, setup.MinimalLayout.id)
    helpers.mocked.uniqueId.mockReturnValueOnce('a')
    state.perform(actA)
    const pathA = actA.destination

    const actB = helpers.createAct('layer.new', null, setup.MinimalLayout.id)
    helpers.mocked.uniqueId.mockReturnValueOnce('b')
    state.perform(actB)
    const pathB = actB.destination

    const actC = helpers.createAct('layer.new', null, setup.MinimalLayout.id)
    helpers.mocked.uniqueId.mockReturnValueOnce('c')
    state.perform(actC)
    const pathC = actC.destination

    const exceptLayers = order => expect(page.state.map(layer => layer.id)).toEqual(order)


    helpers.checkTimeParadox(state, [
      function before() { exceptLayers([ 'a', 'b', 'c' ]) },
      helpers.createAct(pathA, pathB),
      function mid1() { exceptLayers([ 'b', 'a', 'c' ]) },
      helpers.createAct(pathA, pathC),
      function mid2() { exceptLayers([ 'b', 'c', 'a' ]) },
      helpers.createAct(pathA, pathB),
      function after() { exceptLayers([ 'a', 'b', 'c' ]) },
    ])
  })

})
