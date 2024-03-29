import type Path from '../page/path'
import { uniqueId } from '../util'
import ActTarget from './acttarget'

export default class Act<Target extends ActTarget = Path> {
  capturedState?: any
  destination?: Target
  remembered: boolean = false

  meta: any = null

  constructor(
    public action: string,
    // a) that was active just right before this executed
    // b) subject of this action
    public target: Target,
    public arg?: any,
    public sealed: boolean = false,
    public id: string = action + '#' + uniqueId()
  ) {}

  isComposableWith(act: Act<Target>) {
    return this.action === act.action &&
          !this.sealed && !act.sealed &&
          this.target.type === act.target.type &&
          (this.target === act.target || this.target?.isEqual(act.target!))
  }

  // this stores state BEFORE action performed
  remember(capturedState?: any, destination?: Target, force: boolean = false) {
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
