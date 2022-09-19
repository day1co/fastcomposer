import type Action from './Actions/IAction'
import type Act from './Act'
import type Path from './Structs/Path'

import Layout from './Layout'
import Layer from './Layer'

export default class State {
  _state: Array<Layer> = []
  _layouts: Map<string, Layout>
  _actions: Map<string, Action> = new Map()

  _history: Array<Act> = []
  _future: Array<Act> = []

  constructor(
    layouts: Map<string, Layout> | object,
    actions: Map<string, Action>
  ) {
    this._actions = actions

    if(!(layouts instanceof Map))
      this._layouts = new Map(
        Object.entries(layouts)
              .map(([ k, v ]) => [ k, Layout.fromDefinition(v) ])
      )
    else
      this._layouts = layouts
  }

  get state() {
    return this._state
  }
  get _lastAct() {
    return this._history[this._history.length - 1]
  }

  // undo/redo

  _getPast(): Act | undefined {
    const present = this._history.pop()
    if(!present) return
    this._future.push(present)
    return present
  }
  _writePresent(act: Act) {
    this._history.push(act)
    this._future.length = 0
  }
  _getFuture(): Act | undefined {
    const present = this._future.pop()
    if(!present) return
    this._history.push(present)
    return present
  }

  isComposable(action: Action) {
    return this._lastAct?.action === action.id
        && this._lastAct.sealed
        && action.compose != null
  }

  perform(act: Act, isRedo?: boolean) {
    const action = this._actions.get(act.action)
    if(!action)
      throw new Error(`Action '${act.action}' not found (to ${isRedo ? 'redo' : 'perform'})`)

    if(action.compose && this._lastAct.isComposableWith(act)) {
      action.compose(this, this._lastAct, act)
      action.perform(this, this._lastAct)
    } else {
      action.perform(this, act)

      // TODO: move focus

      if(!action.doNotRemember)
        this._writePresent(act)

      if(!action.compose)
        act.seal()

      return act // for what? idk
    }
  }

  rollback(history: Act) {
    const action = this._actions.get(history.action)
    if(!action)
      throw new Error(`Action '${history.action}' not found (to undo)`)

    history.seal()

    if(action.rollback) {
      const target = action.rollback(this, history)
      // TODO: move focus
    } else {
      // means we have nothing able to undo, do nothing
      // why it does even registered on history then???
      // ¯\_(ツ)_/¯
      // originally meant to be multiple redo methods, but idk huh
    }
  }

  redo() {
    const present = this._getFuture()
    if(!present) return
    this.perform(present, true)
  }
  undo() {
    const present = this._getPast()
    if(!present) return
    this.rollback(present)
  }

  // state utils

  getLayerByPath(path: Path): Layer | undefined {
    return this._state.find((layer: Layer) => layer.id === path.layer)
  }
  pathToIndex(path: Path): number | undefined {
    const found = this._state.findIndex((layer: Layer) => layer.id === path.layer)
    return found >= 0? found : undefined; // INTENDED
  }
  indexToPath(index: number): Path | undefined {
    return this._state[index]?.path
  }

  // layout

  getLayout(id: string): Layout {
    const layout: Layout | undefined = this._layouts.get(id)
    if(!layout)
      throw new Error(`specified layout '${id}' not found`)

    return layout
  }
  createLayer(layoutId: string, layerId?: any) {
    return this.getLayout(layoutId).createLayer(layerId)
  }

  // editor actions

  appendLayer(after: Path | undefined, layoutId: string, layerId?: string) {
    const layer = this.createLayer(layoutId, layerId)
    const length = this._state.length
    const index = after? this.pathToIndex(after) ?? length : length

    this._state.splice(index, 0, layer)

    return layer
  }
  restoreLayer(after: Path | undefined, oldLayer: Layer) {
    // FIXME gonna throw them as-is?
    const length = this._state.length
    const index = after? this.pathToIndex(after) ?? length : length

    this._state.splice(index, 0, oldLayer)

    return oldLayer
  }
  duplicateLayer(after: Path, layerId?: string) {
    const index = this.pathToIndex(after)
    if(index == null)
      throw new Error()
    const oldLayer = this._state[index]
    const newLayer = oldLayer.clone(layerId)

    this._state.splice(index + 1, 0, newLayer)

    return newLayer
  }
  reorderLayer(at: Path | number, toWhere: Path | number) {
    const from = typeof at === 'number'? at : this.pathToIndex(at)!
    const to = typeof toWhere === 'number'? toWhere : this.pathToIndex(toWhere)!
    const [ target ] = this._state.splice(from, 1)

    this._state.splice(to, 0, target)

    // kindly tell back as indexes
    return [ from, to ]
  }
  removeLayer(path: Path): number | undefined {
    const index = this.pathToIndex(path) ?? -1
    if(index < 0)
      return

    this._state.splice(index, 1)

    return index
  }

  // edit methods (how??)
  // finalizers (save, etc)
  // how the f**k i should handle list args?
}
