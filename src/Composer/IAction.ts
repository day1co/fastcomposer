import type Act from './Act'
import type State from './index'
import type Path from '../Composer.Page/Path'
import Module from './Module'

export default interface Action<T extends Module> {
  id: string
  perform(self: State, root: T, act: Act): Act
  compose?(self: State, root: T, previousAct: Act, act: Act): Act
  rollback(self: State, root: T, rememberedAct: Act): Path | undefined
  doNotRemember?: boolean
  // TODO: icon/stringifier/whatever for user interfaces
  // TODO: whatever
}
