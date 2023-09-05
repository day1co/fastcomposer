import type Path from '../page/path'
import { uniqueId } from '../util'

export default class Act {
  capturedState?: any
  destination?: Path
  remembered: boolean = false
  id: string

  constructor(
    public action: string,
    // a) that was active just right before this executed
    // b) subject of this action
    public target?: Path,
    public arg?: any,
    public sealed: boolean = false,
    public id: string = action + '#' + uniqueId()
  ) {}

  isComposableWith(act: Act) {
    return this.action === act.action &&
          !this.sealed &&
          (this.target === act.target || this.target?.isEqual(act.target!))
  }

  // this stores state BEFORE action performed
  remember(capturedState?: any, destination?: Path, force: boolean = false) {
    if(this.remembered && !force)
      return
    this.remembered = true
    this.capturedState = capturedState
    this.destination = destination

    return this
  }

  // this modifies act's argument AFTER performed, no idea atm tbh
  update(arg: any) {
    if(this.sealed)
      return // TODO: throw?
    this.arg = arg
  }

  // disable
  seal() {
    this.remembered = true
    this.sealed = true
  }
}
