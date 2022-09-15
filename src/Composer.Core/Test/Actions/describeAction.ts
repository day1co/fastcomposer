import { jest } from '@jest/globals'

jest.mock('../../Util', () => ({
  ...<object>jest.requireActual('../../Util'),
  uniqueId: jest.fn()
}))

import { uniqueId } from '../../Util'

import type Action from '../../Actions/IAction'

import Act from '../../Act'
import Actions from '../../Actions'
import State from '../../State'

import * as setup from '../setup'

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

  // still can't believe this *is* most beloved programming language
  // https://github.com/microsoft/TypeScript/issues/9998
  const _dependentActions = dependentActions

  const helpers: any = {
    mocked: {
      uniqueId: <jest.Mocked<typeof uniqueId>>jest.mocked(uniqueId)
    },
    createState(layouts = setup.MinimalLayouts) {
      const actions = [ actionName, ..._dependentActions ]
        .map(action => <const>[ action, Actions.get(action) ])
      const notfound = actions
        .filter(l => l[1] == null)
        .map(l => l[0])
        .join(', ')

      if(notfound)
        throw new ReferenceError(`following actions requested, \
          but not found in Actions: ${notfound}`)

      return new State(layouts, new Map(actions))
    },
    createAct(...args: ConstructorParameters<typeof Act> | Omit<ConstructorParameters<typeof Act>, 0>) {
      if(typeof args[0] !== 'string') {
        return new Act(actionName, ...args)
      } else {
        // ¯\_(ツ)_/¯
        return new Act(...<ConstructorParameters<typeof Act>>args)
      }

    },
  }

  return describe('Action: ' + actionName, (...args) => cb(helpers, ...args))
}

export default describeAction
