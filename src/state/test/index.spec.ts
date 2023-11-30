import { jest } from '@jest/globals'

import * as setup from './setup'

import Act from '../act'
import State from '..'

describe('Main State Manager', () => {

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be able to initiate normally', () => {
    const noop = new setup.NoopModule()
    const state = new State({ modules: { noop } })

    expect(state.resolveAction('noop')).not.toBeNull()
  })
  /*
  it('should be able to initiate with legacy layout list', () => {
    const state = new State(setup.MinimalLayoutsAsObject, setup.MinimalActions)

    expect(state._layouts).toBeInstanceOf(Map)
    expect(state._layouts.get(setup.MinimalLayout.id)).not.toBeUndefined()
  })
  */
  it('should perform/rollback action (manually)', () => {
    const noop = new setup.NoopModule()
    const state = new State({ modules: { noop } })

    const perform = jest.spyOn(setup.NoopAction, 'perform')
    const rollback = jest.spyOn(setup.NoopAction, 'rollback')

    const act = new Act('noop', null)
    const rememberedAct = state.perform(act)!;

    expect(perform).toBeCalledWith(state, noop, act)
    expect(rememberedAct.remember).toBeTruthy()

    state.rollback(rememberedAct)

    expect(rollback).toBeCalledWith(state, noop, rememberedAct)
  })

  it('should perform/rollback action (by history)', () => {
    const noop = new setup.NoopModule()
    const state = new State({ modules: { noop } })

    const perform = jest.spyOn(setup.NoopAction, 'perform')
    const rollback = jest.spyOn(setup.NoopAction, 'rollback')
    const outerPerform = jest.spyOn(state, 'perform')

    const act1 = new Act('noop', null)
    const rememberedAct1 = state.perform(act1)!;

    expect(perform).toBeCalledWith(state, noop, act1)
    expect(rememberedAct1.remember).toBeTruthy()
    expect(state.past.length).toEqual(1)
    expect(state.future.length).toEqual(0)

    const act2 = new Act('noop', null)
    const rememberedAct2 = state.perform(act2)!;

    const act3 = new Act('noop', null)
    const rememberedAct3 = state.perform(act3)!;


    state.undo()

    // expect(rollback).toBeCalledWith(state, noop, rememberedAct3)
    expect(state.past.length).toEqual(2)
    expect(state.future.length).toEqual(1)

    expect(state.past[0].id).toEqual(rememberedAct1.id)
    expect(state.future[0].id).toEqual(rememberedAct3.id)

    state.undo()

    state.redo()

    // expect(perform).toHaveBeenNthCalledWith(2, state, noop, rememberedAct3)
    // expect(outerPerform).toBeCalledWith(rememberedAct3, true)
    expect(state.past.length).toEqual(2)
    expect(state.future.length).toEqual(1)

    expect(state.past[0].id).toEqual(rememberedAct1.id)
    expect(state.past[1].id).toEqual(rememberedAct2.id)
    expect(state.future[0].id).toEqual(rememberedAct3.id)

  })

})
