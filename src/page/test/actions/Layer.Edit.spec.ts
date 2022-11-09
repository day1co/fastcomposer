import describeAction from './describe-action'
import * as setup from '../setup'

import Path from '../../path'

describeAction('layer.edit', ['layer.new', 'layer.item.new'], helpers => {

  const newValue = 'new value'

  it('should work: do, undo, redo', () => {
    const [ page, state ] = helpers.createState()

    const path = new Path('layer1', 'param1')
    const defaultValue = setup.DEFAULT_VALUE

    let actNew = helpers.createAct('layer.new', null, setup.MinimalLayout.id)
    actNew = actNew.remember(null, path)
    state.perform(actNew)

    helpers.checkTimeParadox(state, {
      before() {
        expect(page.state[0].get(path)).toEqual(defaultValue)
      },
      act: helpers.createAct(path, newValue),
      after() {
        expect(page.state[0].get(path)).toEqual(newValue)
      }
    })
  })

  it('should throw on nonexistent layer', () => {
    const [ page, state ] = helpers.createState(setup.ListLayout)
    const path = new Path('layer1', 'param1')

    expect(() => state.perform(helpers.createAct(path))).toThrowError()
  })

  it('should throw on nonexistent field', () => {
    const [ page, state ] = helpers.createState(setup.ListLayout)

    const path = new Path('layer1', 'list')
    const fullpath = new Path('layer1', 'list', 0, 'param1')

    let actNew = helpers.createAct('layer.new', null, setup.ListLayout.id)
    actNew = actNew.remember(null, path)
    state.perform(actNew)

    expect(() => state.perform(helpers.createAct(fullpath))).toThrowError()
  })

  it('should \'compose\' into single act when possible', () => {
    const [ page, state ] = helpers.createState(setup.MinimalLayout)

    const path = new Path('layer1', 'param1')
    const defaultValue = setup.DEFAULT_VALUE

    let actNew = helpers.createAct('layer.new', null, setup.MinimalLayout.id)
    actNew = actNew.remember(null, path)
    state.perform(actNew)

    let act
    act = state.perform(helpers.createAct(path, '1'))
    act = state.perform(helpers.createAct(path, '12'))
    act = state.perform(helpers.createAct(path, '123'))
    act = state.perform(helpers.createAct(path, '1234'))

    expect(act.sealed).toBeFalsy()
    expect(act.capturedState).toBe(defaultValue)

    expect(state._history.length).toEqual(2)

    act.seal()

    act = state.perform(helpers.createAct(path, '12345'))
    expect(state._history.length).toEqual(3)

    state.undo()
    expect(page.state[0].get(path)).toBe('1234')

    state.undo()
    expect(page.state[0].get(path)).toBe(defaultValue)
  })

  it('should work against fields inside list items', () => {
    const [ page, state ] = helpers.createState(setup.ListLayout)

    const path = new Path('layer1', 'list')
    const fullpath = new Path('layer1', 'list', 0, 'param1')
    const defaultValue = setup.DEFAULT_LIST_VALUE

    let actNew = helpers.createAct('layer.new', null, setup.ListLayout.id)
    actNew = actNew.remember(null, path)
    state.perform(actNew)

    const actNewItem = helpers.createAct('layer.item.new', path)
    state.perform(actNewItem)

    expect(page.state[0].get(path).length).toBe(1)

    helpers.checkTimeParadox(state, {
      before() {
        expect(page.state[0].get(fullpath)).toBe(defaultValue)
      },
      act: helpers.createAct(fullpath, newValue),
      after() {
        expect(page.state[0].get(fullpath)).toBe(newValue)
      }
    })
  })

})
