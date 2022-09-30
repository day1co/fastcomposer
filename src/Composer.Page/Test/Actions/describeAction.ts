import { jest } from '@jest/globals'

jest.mock('../../../Composer/Util', () => ({
  ...<object>jest.requireActual('../../../Composer/Util'),
  uniqueId: jest.fn().mockReturnValue('INVALID')
}))

import { uniqueId } from '../../../Composer/Util'

import Act from '../../../Composer/Act'
import Actions from '../../Actions'
import State from '../../../Composer'

import * as setup from '../setup'
import Layout from '../../Layout'
import Page from '../../'

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
    createAct(...args: ConstructorParameters<typeof Act> |
                  Omit<ConstructorParameters<typeof Act>, 0>): Act {
      // ¯\_(ツ)_/¯
      if(typeof args[0] === 'string' && actionsMap.has(args[0])) // FIXME
        return new Act(...<ConstructorParameters<typeof Act>>args)
      else
        return new Act(actionName, ...args)
    },
    checkTimeParadox(state: State, { before, act, after }) {
      before()

      if(act instanceof Function)
        act = act()
      if(act instanceof Act)
        state.perform(act)

      after(act)

      state.undo()
      before()
      state.redo()
      after(act)
    }
  }

  return describe('Action: ' + actionName, (...args) => cb(helpers, ...args))
}

export default describeAction
