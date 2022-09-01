import type Act from '../Act'
import type State from '../State'
import type Path from '../Structs/Path'

export default interface Action {
  id: string
  perform(self: State, act: Act): Act
  compose?(self: State, act: Act, previousAct: Act): Act | undefined
  rollback(self: State, rememberedAct: Act): Path | undefined
  doNotRemember?: boolean
  // TODO: icon/stringifier/whatever for user interfaces
  // TODO: whatever
}
