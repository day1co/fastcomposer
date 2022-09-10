import { jest } from '@jest/globals'

jest.mock('../../Util', () => ({
  ...<object>jest.requireActual('../../Util'),
  uniqueId: jest.fn()
}))

import { uniqueId } from '../../Util'

import Act from '../../Act'
import Actions from '../../Actions'
import State from '../../State'

import * as setup from '../setup'

export default function describeAction(
  actionName: string,
  cb: (helpers: any, ...rest: any) => any
) {
  // place helpers inside closuers to (maybe)make use of local scope
  const helpers: any = {
    mocked: {
      uniqueId: <jest.Mocked<typeof uniqueId>>jest.mocked(uniqueId)
    },
    createStateWithActionAlone(layouts = setup.MinimalLayouts) {
      const action = Actions.get(actionName)
      if(!action)
        throw new ReferenceError(`test setup for '${actionName}' requested, but not found in Actions`)

      return new State(layouts, new Map([[ actionName, action ]]))
    },
    createAct(...args: Omit<ConstructorParameters<typeof Act>, 0>) {
      return new Act(actionName, ...args)
    }
  }

  describe('Action: ' + actionName, (...args) => cb(helpers, ...args))
}