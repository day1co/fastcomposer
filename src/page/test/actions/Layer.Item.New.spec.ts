import describeAction from './describe-action'
import * as setup from '../setup'

import type { ListLayoutParameter } from '../../../structs/LayoutParameter'

import Path from '../../path'

describeAction('layer.item.new', ['layer.new'], helpers => {

  const path = new Path('layer1', 'list')
  const fullpath = new Path('layer1', 'list', 0, 'param1')

  const defaultValue = setup.DEFAULT_LIST_VALUE

  it('should work: do, undo, redo', () => {
    const [ page, state ] = helpers.createState(setup.ListLayout)

    let actNew = helpers.createAct('layer.new', null, setup.ListLayout.id)
    actNew = actNew.remember(null, path)
    state.perform(actNew)

    helpers.checkTimeParadox(state, {
      before() {
        expect(page.state[0].get(path).length).toBe(0)
      },
      act: helpers.createAct(path),
      after() {
        expect(page.state[0].get(path).length).toBe(1)
        expect(page.state[0].get(fullpath)).toBe(defaultValue)
      }
    })
  })

  it('should throw on nonexistent layer', () => {
    const [ page, state ] = helpers.createState(setup.ListLayout)

    expect(() => state.perform(helpers.createAct(path))).toThrowError()
  })

  it('should throw when adding more item than maxLength', () => {
    const [ page, state ] = helpers.createState(setup.ListLayout)

    let actNew = helpers.createAct('layer.new', null, setup.ListLayout.id)
    actNew = actNew.remember(null, path)
    state.perform(actNew)

    const maxlength = (<ListLayoutParameter>setup.ListLayout.params.get('list')).maxLength
    for(let i = 0; i < maxlength; i++) {
      state.perform(helpers.createAct(path))
    }

    expect(() => state.perform(helpers.createAct(path))).toThrowError()
  })
})
