import type Action from './IAction'
import type State from '../State'
import type Act from '../Act'

export default <Action>{
  id: 'layer.edit',
  perform(self, act) {
    const { path, value } = act.arg!
    const layer = self.getLayerByPath(path)
    if(!layer)
      throw new ReferenceError('attempted to edit nonexistent layer')

    layer.set(path, value)
    return act
  },
  compose(self, act, previousAct) {
    if(previousAct.remembered ||
      previousAct.action !== act.action ||
      previousAct.target?.layer !== act.target?.layer ||
      previousAct.target?.child !== act.target?.child)
      return
    

  },
  rollback(self, rememberedAct) {

  }
}