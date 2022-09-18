import type Path from './Structs/Path'
import { uniqueId } from './Util'

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
    public sealed: boolean = false
  ) {
    this.id = action + '#' + uniqueId()
  }

  isComposableWith(act: Act) {
    return this.action === act.action &&
          !this.sealed &&
           this.target?.layer === act.target?.layer &&
           this.target?.child === act.target?.child &&
           this.capturedState === act.capturedState // FIXME

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
