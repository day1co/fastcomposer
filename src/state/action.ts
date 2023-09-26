import type Act from './act'
import type State from './index'
import type Path from '../page/path'
import Module from './module'

export default interface Action<T extends Module> {
  id: string
  title: string
  perform(self: State, root: T, act: Act): Act
  // return null to discard current act
  compose?(self: State, root: T, previousAct: Act, act: Act): Act | null
  rollback(self: State, root: T, rememberedAct: Act): Path | undefined
  doNotRemember?: boolean
  // TODO: icon/stringifier/whatever for user interfaces
  // TODO: whatever
}
