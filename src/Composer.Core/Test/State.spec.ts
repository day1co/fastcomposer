import { jest } from '@jest/globals'

import * as setup from './setup'

import Act from '../Act'
import State from '../State'

describe('Main State Manager', () => {

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be able to initiate normally', () => {
    const state = new State(setup.MinimalLayouts, setup.MinimalActions)
    
    expect(state._actions.size).toBe(1)
    expect(state._layouts.size).toBe(1)
  })

  it('should be able to initiate with legacy layout list', () => {
    const state = new State(setup.MinimalLayoutsAsObject, setup.MinimalActions)

    expect(state._layouts).toBeInstanceOf(Map)
    expect(state._layouts.get(setup.MinimalLayout.id)).not.toBeUndefined()
  })

  it('should perform/rollback action (manually)', () => {
    const state = new State(setup.MinimalLayouts, setup.MinimalActions)

    const perform = jest.spyOn(setup.NoopAction, 'perform')
    const rollback = jest.spyOn(setup.NoopAction, 'rollback')

    const act = new Act('noop')
    const rememberedAct = state.perform(act)!;
    
    expect(perform).toBeCalledWith(state, act)
    expect(rememberedAct.remember).toBeTruthy()

    state.rollback(rememberedAct)
    
    expect(rollback).toBeCalledWith(state, rememberedAct)
  })

  it('should perform/rollback action (by history)', () => {
    const state = new State(setup.MinimalLayouts, setup.MinimalActions)

    const perform = jest.spyOn(setup.NoopAction, 'perform')
    const rollback = jest.spyOn(setup.NoopAction, 'rollback')
    const outerPerform = jest.spyOn(state, 'perform')

    const act = new Act('noop')
    const rememberedAct = state.perform(act)!;

    expect(perform).toBeCalledWith(state, act)
    expect(rememberedAct.remember).toBeTruthy()
    expect(state._history.length).toEqual(1)
    expect(state._future.length).toEqual(0)

    state.undo()

    expect(rollback).toBeCalledWith(state, rememberedAct)
    expect(state._history.length).toEqual(0)
    expect(state._future.length).toEqual(1)
    
    state.redo()

    expect(perform).toHaveBeenNthCalledWith(2, state, rememberedAct)
    expect(outerPerform).toBeCalledWith(rememberedAct, true)
  })

})