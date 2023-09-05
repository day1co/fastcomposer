import type Action from './action'
import type Path from '../page/path'
import Act from './act'
import Module from './module'

export default class State {

  modules: { [key: string]: Module } = {}

  past: Array<Act> = []
  future: Array<Act> = []

  _actionMap: Map<string, string> = new Map()

  constructor({ modules }) {
    for(const key in modules) {
      const module = modules[key]
      this.registerModule(key, module)
    }
  }

  // modules

  registerModule(key: string, module: Module) {
    const alreadyExists = this.modules[key] != null
    this.modules[key] = module

    for(const [id] of module.actions) {
      const alreadyMappedTo = this._actionMap.get(id)
      if(!alreadyExists && alreadyMappedTo != null && alreadyMappedTo !== id)
        throw new TypeError(`action '${id}' from module '${key}' conflicts with '${alreadyMappedTo}'`)

      this._actionMap.set(id, key)
    }
  }
  resolveAction(key: string): [ Module, Action<any> ] {
    // TODO: WTF
    const moduleMappedTo = this._actionMap.get(key)
    if(!moduleMappedTo)
      throw new ReferenceError(`action '${key}' couldn't be found in actionMap, did module registered correctly?`)

    const module = this.modules[moduleMappedTo]
    const action = module.actions.get(key)
    if(!action)
      throw new ReferenceError(`action '${key}' found in module '${module}', but action couldn't be found`)

    return [ module, action ]
  }
  // history helpers

  get _lastAct() {
    return this.past[this.past.length - 1]
  }

  _getPast(): Act | undefined {
    const present = this.past.pop()
    if(!present) return
    this.future.push(present)
    return present
  }
  _writePresent(act: Act) {
    this.past.push(act)
    this.future.length = 0
  }
  _getFuture(): Act | undefined {
    const present = this.future.pop()
    if(!present) return
    this.past.push(present)
    return present
  }

  isComposable(action: Action<any>) {
    return action.compose != null
        && this._lastAct?.action === action.id
        && !this._lastAct.sealed
  }

  act(...params: ConstructorParameters<typeof Act>) {
    const act = new Act(...params)
    return this.perform(act)
  }

  perform(act: Act, isRedo?: boolean) {
    const [ module, action ] = this.resolveAction(act.action)

    if(action.compose && this._lastAct.isComposableWith(act)) {
      action.compose(this, module, this._lastAct, act)
      action.perform(this, module, this._lastAct)

      return this._lastAct
    } else {
      action.perform(this, module, act)

      // TODO: move focus

      if(!action.doNotRemember && !isRedo)
        this._writePresent(act)

      if(!action.compose)
        act.seal()

      return act
    }
  }

  rollback(history: Act) {
    const [ module, action ] = this.resolveAction(history.action)

    history.seal()

    if(action.rollback) {
      // eslint-disable-next-line no-unused-vars
      // TODO: move focus
      const target = action.rollback(this, module, history)
    } else {
      // means we have nothing able to undo, do nothing
      // why it did even registered on history then???
      // ¯\_(ツ)_/¯
      // originally meant to be multiple redo methods, but idk huh
    }
  }

  redo() {
    const present = this._getFuture()
    if(!present) return
    this.perform(present, true)
  }
  undo() {
    const present = this._getPast()
    if(!present) return
    this.rollback(present)
  }

}
