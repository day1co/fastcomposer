import describeAction from './describeAction'
import * as setup from '../setup'
import Path from '../../Path'

describeAction('layer.duplicate', ['layer.new'], helpers => {

  it('should work: do, undo, redo', () => {
    const [ page, state ] = helpers.createState()

    let actNew = helpers.createAct('layer.new', null, setup.MinimalLayout.id)
    actNew.remember(null, new Path('a'))
    actNew = state.perform(actNew)

    expect(actNew.destination.layer).toBe('a')

    helpers.checkTimeParadox(state, {
      before() {
        expect(page.state.length).toEqual(1)
        expect(page.state[0].id).toBe('a')
      },
      act() {
        const act = helpers.createAct(actNew.destination)
        helpers.mocked.uniqueId.mockReturnValueOnce('b')
        return act
      },
      after() {
        expect(page.state.length).toEqual(2)
        expect(page.state[0].id).toBe('a')
        expect(page.state[1].id).toBe('b')
      }
    })
  })

  it('should throw on nonexistent layer', () => {
    const [ page, state ] = helpers.createState(setup.ListLayout)

    expect(() => state.perform(helpers.createAct(new Path('?')))).toThrowError()
  })

  // it('should clone() to cut reference of its value', () => {})
})
