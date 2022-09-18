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
    public composable: boolean = false
  ) {
    this.id = action + '#' + uniqueId()
  }

  // this stores state BEFORE action performed
  remember(capturedState?: any, destination?: Path) {
    this.remembered = true
    this.capturedState = capturedState
    this.destination = destination
    
    return this
  }
}
