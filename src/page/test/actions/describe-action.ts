import { jest } from '@jest/globals'

jest.mock('../../../util', () => ({
  ...<object>jest.requireActual('../../../util'),
  uniqueId: jest.fn().mockReturnValue('INVALID')
}))

import { uniqueId } from '../../../util'

import Act from '@day1co/fastcomposer-state/act'
import Actions from '../../actions'
import State from '@day1co/fastcomposer-state'
import type ActTarget from '@day1co/fastcomposer-state/acttarget'
import type Path from '../../path'

import * as setup from '../setup'
import { LegacyLayout as Layout } from '@day1co/fastcomposer-layout/layouts'
import Page from '../../page'

const createHelper = ({ actionsMap, actionName }) => ({
  mocked: {
    uniqueId: <jest.Mocked<typeof uniqueId>>jest.mocked(uniqueId)
  },
  createState(layouts: Layout | Map<string, Layout> = setup.MinimalLayouts): [ Page, State ] {
    if(layouts instanceof Layout)
      layouts = new Map([ [ layouts.id, layouts ] ])

    const page = new Page(layouts, new Map(actionsMap))
    const state = new State({ modules: { page }})
    return [ page, state ]
  },
  createAct( // <<<FIXME
    ...args: typeof Act<Path> extends new (arg0: infer Arg0, ...rest: infer R) => any ? [Arg0, ...R] | R : never
  ): Act<Path> {
    // ¯\_(ツ)_/¯
    if(!(typeof args[0] === 'string' && actionsMap.has(args[0])))
      args.unshift(actionName)

    return new Act<Path>(...<ConstructorParameters<typeof Act<Path>>>args)
  },
  checkTimeParadox(state: State, assertions: Array<Function | Act<Path>>) {
    const runAct = act => {
      if(act instanceof Function)
        act = act()
      if(act instanceof Act)
        state.perform(act)
    }

    const iterate = (item, phase) => {
      if(item instanceof Function && item.name === 'act' || item instanceof Act)
        if(phase === 0) {
          console.log(`phase ${phase}, executing act`)
          runAct(item)
        } else if(phase % 2) {
          console.log(`phase ${phase}, undo`)
          state.undo()
        } else {
          console.log(`phase ${phase}, redo`)
          state.redo()
        }
      else if(item instanceof Function){
        console.log(`phase ${phase}, executed function '${item.name}'`)
        item()
      }
    }

    // run tests forward & back & forward
    // set more phases to extend loops
    const len = assertions.length
    for(
      let i = 0, phase = 0;
      0 <= i && i < len && phase <= 2;
      phase % 2? i-- : i++, phase += +(i < 0 || len <= i)
    ) {
      iterate(assertions[i], phase)
    }
  }
})

type Helper = ReturnType<typeof createHelper>

function describeAction(
  actionName: string,
  cb: (helpers: Helper, ...rest: any) => any
): void
function describeAction(
  actionName: string,
  dependentActions: Array<string>,
  cb: (helpers: Helper, ...rest: any) => any
): void

function describeAction(
  actionName: string,
  dependentActions: Array<string> | ((helpers: Helper, ...rest: any) => any),
  cb?: (helpers: Helper, ...rest: any) => any
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

  const _helpers = createHelper({ actionsMap, actionName })

  return describe('Action: ' + actionName, (...args) => cb(_helpers, ...args))
}

export default describeAction
