import describeAction from './describeAction'
import * as setup from '../setup'

import Path from '../../Path'

describeAction('layer.new', helpers => {

  it('should work: do, undo, redo', () => {
    const state = helpers.createState()

    helpers.checkTimeParadox(state, {
      before() {
        expect(state._state.length).toBe(0)
      },
      act() {
        const act = helpers.createAct(null, setup.MinimalLayout.id)
        helpers.mocked.uniqueId.mockReturnValueOnce('a')
        return act
      },
      after() {
        expect(state._state.length).toBe(1)
        expect(state._state[0].id).toBe('a')
        expect(state._state[0].values).toEqual(setup.MinimalLayout.defaultValues)
      }
    })
  })

  it('should not fill default value of list (which isn\'t specified)', () => {
    const state = helpers.createState(setup.ListLayout)

    const path = new Path('layer1', 'list')

    let actNew = helpers.createAct(null, setup.ListLayout.id)
    actNew = actNew.remember(null, path)
    state.perform(actNew)

    expect(state.state[0].get(path).length).toBe(0)
  })

})
