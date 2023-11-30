import { jest } from '@jest/globals'

jest.mock('../../../util', () => ({
  ...<object>jest.requireActual('../../../util'),
  uniqueId: jest.fn().mockReturnValue('INVALID')
}))

import { uniqueId } from '../../../util'

import Act from '../../../state/act'
import Actions from '../../actions'
import State from '../../../state'
import type ActTarget from '../../../state/acttarget'

import * as setup from '../setup'
import Layout from '../../../layout/legacy'
import Page from '../..'

type AnyAct = Act<ActTarget>

function describeAction(
  actionName: string,
  cb: (helpers: any, ...rest: any) => any
): void
function describeAction(
  actionName: string,
  dependentActions: Array<string>,
  cb: (helpers: any, ...rest: any) => any
): void

function describeAction(
  actionName: string,
  dependentActions: Array<string> | ((helpers: any, ...rest: any) => any),
  cb?: (helpers: any, ...rest: any) => any
) {
  if(!Array.isArray(dependentActions)) {
    cb = dependentActions
    dependentActions = []
  }

  const actions = [ actionName, ...dependentActions ].map(action =>
    <const>[ action, Actions.get(action)
  ])
  const notfound = actions.filter(l => l[1] == null).map(l => l[0]).join(', ')
  if(notfound)
    throw new ReferenceError(`following actions requested, \
      but not found in Actions: ${notfound}`)

  const actionsMap = new Map(actions)

  const helpers: any = {
    mocked: {
      uniqueId: <jest.Mocked<typeof uniqueId>>jest.mocked(uniqueId)
    },
    createState(layouts = setup.MinimalLayouts): [ Page, State ] {
      if(layouts instanceof Layout)
        layouts = new Map([ [ layouts.id, layouts ] ])

      const page = new Page(layouts, new Map(actionsMap))
      const state = new State({ modules: { page }})
      return [ page, state ]
    },
    createAct(...args: ConstructorParameters<typeof Act<ActTarget>> |
                  Omit<ConstructorParameters<typeof Act<ActTarget>>, 0>): Act<ActTarget> {
      // ¯\_(ツ)_/¯
      if(!(typeof args[0] === 'string' && actionsMap.has(args[0]))) // FIXME
        args.unshift(actionName)

      return new Act(...<ConstructorParameters<typeof Act<ActTarget>>>args)
    },
    checkTimeParadox(state: State, assertions: Array<Function | Act>) {
      const runAct = act => {
        if(act instanceof Function)
          act = act()
        if(act instanceof Act)
          state.perform(act)
      }

      const iterate = (item, phase) => {
        const direction = phase % 2

        if(item instanceof Function && item.name === 'act' || item instanceof Act)
          if(phase === 0)
            runAct(item)
          else if(direction === 0)
            state.redo()
          else
            state.undo()

        else if(item instanceof Function)
          item()
      }

      // run tests forward & back & forward
      // set more phases to extend loops
      const len = assertions.length
      for(
        let i = 0, phase = 0;
        0 <= i && i < len && phase <= 2;
        phase % 2? i++ : i--, phase += +(i < 0 || len <= i)
      )
        iterate(assertions[i], phase)
    }
  }

  return describe('Action: ' + actionName, (...args) => cb(helpers, ...args))
}

export default describeAction
