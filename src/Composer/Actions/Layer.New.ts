import type Action from './IAction'

export default <Action>{
  id: 'layer.new',
  perform(self, act) {
    const { target, arg, destination } = act
    const newLayer = self.appendLayer(target, arg, destination?.layer)

    return act.remember(null, newLayer.path)
  },
  rollback(self, { destination }) {
    self.removeLayer(destination!)
  }
}
