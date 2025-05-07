import ActTarget from './acttarget'

const generateId = () => {
  // 24 bits timestamp
  const upper = ((performance.now() * 10) & 0xffffff) << 16
  // 16 bits entropy
  const lower = (Math.random() * 0xffff & 0xffff)
  // 40 bits = 8 letters in base32
  return (upper + lower).toString(32)
}

export default class Act<Target extends ActTarget> {
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
    public id: string = action + '#' + generateId()
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
