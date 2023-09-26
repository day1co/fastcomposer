import Path from '../page/path'
import Action from './action'

export default abstract class Module {
  id: string

  actions: Map<string, Action<Module>>
  state: any

  constructor(actions: Map<string, Action<Module>>) {
    this.actions = actions
  }

  describePath?(path?: Path): string | null
}
