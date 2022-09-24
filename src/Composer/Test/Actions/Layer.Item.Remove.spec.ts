import describeAction from './describeAction'
import * as setup from '../setup'

import type ListLayoutParameter from '../../Structs/ListLayoutParameter'

import Path from '../../Path'

describeAction('layer.item.remove', ['layer.new', 'layer.item.new', 'layer.edit'], helpers => {

  const path = new Path('layer1', 'list')
  const childpath0 = new Path('layer1', 'list', 0, 'param1')
  const childpath1 = new Path('layer1', 'list', 1, 'param1')

  const defaultValue = setup.DEFAULT_LIST_VALUE

  it('should work: do, undo, redo', () => {
    const state = helpers.createState(setup.ListLayout)

    let actNew = helpers.createAct('layer.new', null, setup.ListLayout.id)
    actNew = actNew.remember(null, path)
    state.perform(actNew)

    state.perform(helpers.createAct('layer.item.new', path))
    state.perform(helpers.createAct('layer.item.new', path))

    state.perform(helpers.createAct('layer.edit', childpath0, 'item value 1'))
    state.perform(helpers.createAct('layer.edit', childpath1, 'item value 2'))

    helpers.checkTimeParadox(state, {
      before() {
        console.dir(state.state, { depth: 4 })
        expect(state.state[0].get(path).length).toBe(2)
        expect(state.state[0].get(childpath0)).toBe('item value 1')
        expect(state.state[0].get(childpath1)).toBe('item value 2')
      },
      act: helpers.createAct(childpath0),
      after() {
        expect(state.state[0].get(path).length).toBe(1)
        expect(state.state[0].get(childpath0)).toBe('item value 2')
      }
    })
  })
})
