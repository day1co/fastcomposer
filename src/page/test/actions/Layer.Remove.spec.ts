import describeAction from './describe-action'
import * as setup from '../setup'

import type Act from '@day1co/fastcomposer-state/act'

import Path from '../../path'
import { Paths } from '../../path'

describeAction('layer.remove', ['layer.new'], helpers => {

  it('should work with single layer: do, undo', () => {
    const [ page, state ] = helpers.createState()

    let actNew = helpers.createAct('layer.new', null, setup.MinimalLayout.id)
    helpers.mocked.uniqueId.mockReturnValueOnce('a')
    actNew = <Act<Path>>state.perform(actNew)

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

  it('should work with multiple layers: do, undo', () => {
    const [ page, state ] = helpers.createState()

    // Create 3 layers
    const actA = helpers.createAct('layer.new', null, setup.MinimalLayout.id)
    helpers.mocked.uniqueId.mockReturnValueOnce('a')
    state.perform(actA)
    const pathA = actA.destination

    const actB = helpers.createAct('layer.new', null, setup.MinimalLayout.id)
    helpers.mocked.uniqueId.mockReturnValueOnce('b')
    state.perform(actB)
    const pathB = actB.destination

    const actC = helpers.createAct('layer.new', null, setup.MinimalLayout.id)
    helpers.mocked.uniqueId.mockReturnValueOnce('c')
    state.perform(actC)
    const pathC = actC.destination

    const paths = new Paths([pathA, pathB])

    helpers.checkTimeParadox(state, [
      function before() {
        expect(page.state.length).toEqual(3)
        expect(page.state.map(l => l.id)).toEqual(['a', 'b', 'c'])
      },
      helpers.createAct(paths),
      function after() {
        expect(page.state.length).toEqual(1)
        expect(page.state[0].id).toBe('c')
      }
    ])
  })

  it('should maintain correct order when removing multiple non-adjacent layers', () => {
    const [ page, state ] = helpers.createState()

    // Create 5 layers
    const layers = ['a', 'b', 'c', 'd', 'e'].map(id => {
      const act = helpers.createAct('layer.new', null, setup.MinimalLayout.id)
      helpers.mocked.uniqueId.mockReturnValueOnce(id)
      state.perform(act)
      return act.destination
    })

    // Remove first and fourth layers (a, d)
    const paths = new Paths([layers[3], layers[0]])

    helpers.checkTimeParadox(state, [
      function before() {
        expect(page.state.map(l => l.id)).toEqual(['a', 'b', 'c', 'd', 'e'])
      },
      helpers.createAct(paths),
      function after() {
        expect(page.state.map(l => l.id)).toEqual(['b', 'c', 'e'])
      }
    ])
  })

  it('should throw on nonexistent layer', () => {
    const [ page, state ] = helpers.createState(setup.ListLayout)

    expect(() => state.perform(helpers.createAct(new Path('?')))).toThrowError()
    expect(() => state.perform(helpers.createAct(new Paths([new Path('?')])))).toThrowError()
  })

})
