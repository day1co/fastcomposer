import describeAction from './describeAction'
import * as setup from '../setup'

import Path from '../../Path'

describeAction('layer.edit', ['layer.new', 'layer.item.new'], helpers => {

  const newValue = 'new value'

  it('should work: do, undo, redo', () => {
    const state = helpers.createState()

    const path = new Path('layer1', 'param1')
    const defaultValue = setup.DEFAULT_VALUE

    let actNew = helpers.createAct('layer.new', null, setup.MinimalLayout.id)
    actNew = actNew.remember(null, path)
    state.perform(actNew)

    helpers.checkTimeParadox(state, {
      before() {
        expect(state.state[0].get(path)).toEqual(defaultValue)
      },
      act: helpers.createAct(path, newValue),
      after() {
        expect(state.state[0].get(path)).toEqual(newValue)
      }
    })
  })

  it('should work against fields inside list items', () => {
    const state = helpers.createState(setup.ListLayout)

    const path = new Path('layer1', 'list')
    const fullpath = new Path('layer1', 'list', 0, 'param1')
    const defaultValue = setup.DEFAULT_LIST_VALUE

    let actNew = helpers.createAct('layer.new', null, setup.ListLayout.id)
    actNew = actNew.remember(null, path)
    state.perform(actNew)

    const actNewItem = helpers.createAct('layer.item.new', path)
    state.perform(actNewItem)

    expect(state.state[0].get(path).length).toBe(1)

    helpers.checkTimeParadox(state, {
      before() {
        expect(state.state[0].get(fullpath)).toBe(defaultValue)
      },
      act: helpers.createAct(fullpath, newValue),
      after() {
        expect(state.state[0].get(fullpath)).toBe(newValue)
      }
    })
  })

})
