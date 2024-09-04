import describeAction from './describe-action'
import * as setup from '../setup'

import type Act from '@day1co/fastcomposer-state/act'

import Path from '../../path'

describeAction('layer.remove', ['layer.new'], helpers => {

  it('should work: do, undo', () => {
    const [ page, state ] = helpers.createState()

    let actNew = helpers.createAct('layer.new', null, setup.MinimalLayout.id)
    helpers.mocked.uniqueId.mockReturnValueOnce('a')
    actNew = <Act<Path>>state.perform(actNew)

    console.log(page.state)

    expect(actNew.destination.layer).toBe('a')

    helpers.checkTimeParadox(state, [
      function before() {
        expect(page.state.length).toEqual(1)
        expect(page.state[0].id).toBe('a')
      },
      helpers.createAct(actNew.destination),
      function after() {
        expect(page.state.length).toEqual(0)
      }
    ])
  })

  it('should throw on nonexistent layer', () => {
    const [ page, state ] = helpers.createState(setup.ListLayout)

    expect(() => state.perform(helpers.createAct(new Path('?')))).toThrowError()
  })

})
