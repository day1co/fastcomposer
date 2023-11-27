import type Act from './act'
import type State from './index'
import type Path from '../page/path'
import type ActTarget from './acttarget'
import Module from './module'

export default interface Action<T extends Module, Target extends ActTarget> {
  id: string
  title: string
  perform(root: State, self: T, act: Act<Target>): Act<Target>
  // return null to discard current act
  compose?(root: State, self: T, previousAct: Act<Target>, act: Act<Target>): Act<Target> | null
  rollback(root: State, self: T, rememberedAct: Act<Target>): Path | undefined
  doNotRemember?: boolean
  // TODO: icon/stringifier/whatever for user interfaces
  // TODO: whatever
}
