import describeAction from './describe-action'
import * as setup from '../setup'

import type Act from '@day1co/fastcomposer-state/act'

import Path from '../../path'

describeAction('layer.item.remove', ['layer.new', 'layer.item.new', 'layer.edit'], helpers => {

  const path = new Path('layer1', 'list')
  const childpath0 = new Path('layer1', 'list', 0, 'param1')
  const childpath1 = new Path('layer1', 'list', 1, 'param1')

  it('should work: do, undo, redo', () => {
    const [ page, state ] = helpers.createState(setup.ListLayout)

    const actNew = <Act<Path>>state.perform(
      helpers
        .createAct('layer.new', null, setup.ListLayout.id)
        .remember(null, path)
    )

    state.perform(helpers.createAct('layer.item.new', path))
    state.perform(helpers.createAct('layer.item.new', path))

    state.perform(helpers.createAct('layer.edit', childpath0, 'item value 1'))
    state.perform(helpers.createAct('layer.edit', childpath1, 'item value 2'))

    helpers.checkTimeParadox(state, [
      function before() {
        expect(page.state[0].get(path).length).toBe(2)
        expect(page.state[0].get(childpath0)).toBe('item value 1')
        expect(page.state[0].get(childpath1)).toBe('item value 2')
      },
      helpers.createAct(childpath0),
      function after() {
        expect(page.state[0].get(path).length).toBe(1)
        expect(page.state[0].get(childpath0)).toBe('item value 2')
      }
    ])
  })

  it('should throw on nonexistent layer', () => {
    const [ page, state ] = helpers.createState(setup.ListLayout)

    expect(() => state.perform(helpers.createAct(path))).toThrowError()
  })

})
