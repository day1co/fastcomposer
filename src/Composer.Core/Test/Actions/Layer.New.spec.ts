import describeAction from './describeAction'

import * as setup from '../setup'

describeAction('layer.new', (helpers) => {

  it('should able to create new layer', () => {
    const state = helpers.createStateWithActionAlone()
    const act = helpers.createAct(null, setup.MinimalLayout.id)

    helpers.mocked.uniqueId.mockReturnValueOnce('a')
    state.perform(act)
    
    expect(state._state.length).toEqual(1)
    expect(state._state[0].id).toBe('a')
  })

})
