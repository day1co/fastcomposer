import Action from './action'
import type ActTarget from './acttarget'

export default abstract class Module {
  id: string

  actions: Map<string, Action<Module, ActTarget>>
  state: any

  constructor(actions: Map<string, Action<Module, ActTarget>>) {
    this.actions = actions
  }

  describe?(path?: ActTarget): string | null
}
