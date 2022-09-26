import describeAction from './describeAction'
import * as setup from '../../Composer/Test/setup'

describeAction('layer.remove', ['layer.new'], helpers => {

  it('should work: do, undo', () => {
    const [ page, state ] = helpers.createState()

    let actNew = helpers.createAct('layer.new', null, setup.MinimalLayout.id)
    helpers.mocked.uniqueId.mockReturnValueOnce('a')
    actNew = state.perform(actNew)
    expect(actNew.destination.layer).toBe('a')

    helpers.checkTimeParadox(state, {
      before() {
        expect(page.state.length).toEqual(1)
        expect(page.state[0].id).toBe('a')
      },
      act: helpers.createAct(actNew.destination),
      after() {
        expect(page.state.length).toEqual(0)
      }
    })
  })

})
