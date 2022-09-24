import type Act from '../Act'
import type State from '../State'
import type Path from '../Path'

export default interface Action {
  id: string
  perform(self: State, act: Act): Act
  compose?(self: State, previousAct: Act, act: Act): Act
  rollback(self: State, rememberedAct: Act): Path | undefined
  doNotRemember?: boolean
  // TODO: icon/stringifier/whatever for user interfaces
  // TODO: whatever
}
