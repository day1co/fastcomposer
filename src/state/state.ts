import Act from './act'
import type Action from './action'
import type ActTarget from './acttarget'
import Module from './module'

export default class State {

  modules: { [key: string]: Module } = {}

  past: Array<Act<ActTarget>> = []
  future: Array<Act<ActTarget>> = []

  _actionMap: Map<string, string> = new Map()

  constructor({ modules = {} } = {}) {
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
  resolveAction(key: string): [ Module, Action<any, ActTarget> ] {
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

  get lastAct() {
    return this.past[this.past.length - 1]
  }

  _getPast(): Act<ActTarget> | undefined {
    const present = this.past.pop()
    if(!present) return
    this.future.push(present)
    return present
  }
  _discardPast(): void {
    this.past.pop()
  }
  _writePresent(act: Act<ActTarget>) {
    this.past.push(act)
    this.future.splice(0, this.future.length)
  }
  _getFuture(): Act<ActTarget> | undefined {
    const present = this.future.pop()
    if(!present) return
    this.past.push(present)
    return present
  }

  act(...params: ConstructorParameters<typeof Act>) {
    const act = new Act(...params)
    return this.perform(act, false)
  }

  perform(act: Act<ActTarget>, isRedo?: boolean, doNotCompose?: boolean) {
    const [ module, action ] = this.resolveAction(act.action)

    if(action.compose && !doNotCompose && this.lastAct?.isComposableWith(act)) {
      action.perform(this, module, act)

      const updatedAct = action.compose(this, module, this.lastAct, act)
      // if nothing returned, consider act has been 'nullified'
      if(!updatedAct)
        this._discardPast()
      // if new act (instead of updated lastAct) returned, consider it uncomposable and write present
      else if(Object.is(act, updatedAct) && !action.doNotRemember && !isRedo) {
        act.meta ||= module.describe?.(act.target)
        this._writePresent(act)
      }

      return updatedAct
    } else {
      act.meta ||= module.describe?.(act.target)
      action.perform(this, module, act)

      // TODO: move focus

      if(!action.doNotRemember && !isRedo)
        this._writePresent(act)

      if(!action.compose)
        act.seal()

      return act
    }
  }

  rollback(history: Act<ActTarget>) {
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
