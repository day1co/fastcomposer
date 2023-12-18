import type Action from '../state/action'
import type ActTarget from '../state/acttarget'

import Module from '../state/module'
import Actions from './actions'
import Path, { Paths } from './path'
import Layer from './layer'
import LayoutBase from '../layout'
import LegacyLayout from '../layout/legacy'
import { uniqueId } from '../util'

type LayoutMap = Map<string, LayoutBase>
type LooseLayoutMap = LayoutMap | object

export default class Page extends Module {

  id: 'page'

  actions: Map<string, Action<Page, ActTarget>>
  state: Array<Layer> = []

  focus: Path | null = null

  _layouts: Map<string, LayoutBase>

  _stateLookup: { [K: Layer['id']]: number } = {}

  constructor(
    layouts: Map<string, LayoutBase> | object,
    actions: Map<string, Action<Page, ActTarget>> = Actions
  ) {
    super(actions)

    this._layouts = Page.tightenLooseLayouts(layouts)
  }

  static tightenLooseLayouts(layouts: LooseLayoutMap): LayoutMap {
    return Object.freeze(
      layouts instanceof Map
      ? layouts
      : new Map(
          Object.values(layouts)
                .map(def => [ def.id, LegacyLayout.fromDefinition(def) ])
        )
    )
  }

  // save/load

  static fromDump(state: Array<any>, providedLayouts?: LooseLayoutMap) {
    const layouts = providedLayouts !== null
      ? Page.tightenLooseLayouts(providedLayouts)
      : <LayoutMap>new Map()

    const result = state.map(layerdef => {
      const { id, layout } = layerdef
      const layoutId = typeof layout === 'string'? layout : layout.id
      const foundLayout = <LegacyLayout>layouts.get(layoutId) // FIXME: will not work with non-legacy layout
      const recoveredLayout = LegacyLayout.fromDefinition(layout)

      // TODO: reconsider recover level; now using lv1
      // lv0: throw
      // lv1: use layout from layer, or throw
      // lv2: use 'broken' layout even for worst case

      if(!recoveredLayout && !(providedLayouts && !foundLayout)) {
        throw new ReferenceError(`layout '${layoutId}' of layer '${id}' `
          + `couldn't be found from layout list which was provided`)
      }

      // foundLayout will automatically fill missing layout definitions
      // AND prevent re-initialize Layouts, this is bit tricky
      // so TODO: should we consider inconsistent layout defs between layers?
      const layer = Layer.fromDump(layerdef, foundLayout || recoveredLayout)

      if(!foundLayout && recoveredLayout)
        layouts.set(layer.layout.id, recoveredLayout)

      return layer
    })

    const page = new Page(layouts)
    page.state = result
    return page
  }
  dump() {
    return this.state.map(layer => layer.dump())
  }
  render() {
    // TODO isolate?
    return this.state.flatMap(layer => [
      `<section class="fc-block fc-layout fc-layout-${layer.layout.id}">`,
      layer.render(null),
      `</section>`
    ]).join('\n')
  }
  validateAll() {
    return this.state.flatMap(layer => layer.updateValidity())
  }

  // state utils

  _updateLookup() {
    this._stateLookup = {}
    for(const index in this.state) {
      this._stateLookup[this.state[index].id] = +index // 아오 망할 ts
    }
  }
  getLayerByPath(path: Path): Layer | undefined {
    return /*this.state[this._stateLookup[path.layer]] ??*/ this.state.find((layer: Layer) => layer.id === path.layer)
  }
  pathToIndex(path: Path): number | undefined {
    let found

    // found = this._stateLookup[path.layer]
    // if(found != null) return found

    found = this.state.findIndex((layer: Layer) => layer.id === path.layer)
    return found >= 0? found : undefined; // INTENDED
  }
  indexToPath(index: number): Path | undefined {
    return this.state[index]?.path
  }

  // layout

  getLayout(id: string): LayoutBase {
    const layout: LayoutBase | undefined = this._layouts.get(id)
    if(!layout)
      throw new Error(`specified layout '${id}' not found`)

    return layout
  }
  createLayer(layoutId: string, layerId: string = uniqueId()) {
    const layout = this.getLayout(layoutId)
    return new Layer(layerId, layout)
  }

  // editor actions

  appendLayer(after: Path | undefined, layoutId: string, layerId?: string) {
    const layer = this.createLayer(layoutId, layerId)
    const length = this.state.length
    const index = (after? this.pathToIndex(after) ?? length : length) + 1

    this.state.splice(index, 0, layer)

    this._updateLookup()
    return layer
  }
  restoreLayer(after: Path | undefined, oldLayer: Layer) {
    // FIXME gonna throw them as-is?
    const length = this.state.length
    const index = after? this.pathToIndex(after) ?? length : length

    this.state.splice(index, 0, oldLayer)

    this._updateLookup()
    return oldLayer
  }
  duplicateLayer(after: Path, layerId?: string) {
    const index = this.pathToIndex(after)
    if(index == null)
      throw new Error()
    const oldLayer = this.state[index]
    const newLayer = oldLayer.clone(layerId)

    this.state.splice(index + 1, 0, newLayer)

    this._updateLookup()
    return newLayer
  }
  reorderLayer(at: Path | number, toWhere: Path | number) {
    const from = typeof at === 'number'? at : this.pathToIndex(at)!
    const to = typeof toWhere === 'number'? toWhere : this.pathToIndex(toWhere)!
    // console.log(`moving layer #${from} (path ${at.toString()} id ${this.state[from].id}) to #${to} (path ${toWhere.toString()} id ${this.state[to].id})`)
    const [ target ] = this.state.splice(from, 1)
    this.state.splice(to, 0, target)

    this._updateLookup()
    // kindly tell back as indexes
    return [ from, to ]
  }
  reorderMultipleLayers(layers: Array<Path>, toWhere: Path | number): [[number, number][], number] {
    const originalTo = typeof toWhere === 'number'? toWhere : this.pathToIndex(toWhere)!
    let to = originalTo
    let fromDelta = 0
    const indexes = layers.map(path => this.pathToIndex(path)!).sort((a, b) => a - b)

    let left, right

    if(indexes.includes(to)) {
      const chunks = indexes.reduce((p, c) => {
        if(p.at(-1)?.at(-1) - c !== -1)
          p.push([c])
        else
          p.at(-1).push(c)
        return p
      }, [])
      const center = chunks.findIndex(_ => _.includes(to))

      left = chunks.slice(0, center).flat()
      right = chunks.slice(center + 1).flat()
    } else {
      let center = indexes.findIndex(i => to <= i)

      if(center === -1)
        if(indexes[indexes.length - 1] < to)
          center = indexes.length
        else
          center = 0

      left = indexes.slice(0, center)
      right = indexes.slice(indexes[center] === to? center + 1 : center)
    }


    const history = [
      ...left.map(_ => [_, _ + 1]).reverse(),
      ...right.map(_ => [_, _ - 1])
    ]

    for(const [from, to] of history) {
      this.reorderLayer(from, to)
    }

    return [ history, originalTo ]
  }
  restoreMultipleLayers(history: Array<[number, number]>) {
    for(let i = history.length - 1; i >= 0; i--) {
      let [from, to] = history[i]
      this.reorderLayer(to, from)
    }
  }
  removeLayer(path: Path): number | undefined {
    const index = this.pathToIndex(path) ?? -1
    if(index < 0)
      return

    this.state.splice(index, 1)

    this._updateLookup()
    return index
  }

  setFocus(path?: Path | Paths) {
    // TODO: onfocuschange?
    if(!path)
      return
    if(path.type === 'paths')
      this.focus = path.paths[0]
    else
      this.focus = path ?? null
  }
  setFocusByIndex(index: number) {
    this.focus = this.indexToPath(index)
  }
  get focusedIndex() {
    return this.focus? this.pathToIndex(this.focus) : -1
  }
  get currentLayer() {
    return this.focus? this.getLayerByPath(this.focus) : null
  }

  describe(path?: Path | Paths): string | null {
    if(!path) return ''

    let suffix = ''
    if(path.type === 'paths') {
      suffix = `…+${path.paths.length - 1}`
      path = path.paths[0]
    }
    if(!path) return;
    const layout = this.getLayerByPath(path)?.layout
    if(!layout) return;
    const index = this.pathToIndex(path)

    const child = layout.params.get(path.child)

    if(!child)
      return `${layout.id} #${index}${suffix}`

    const grandchild = layout.getListParams(path.child)?.get(path.grandchild)

    if(!grandchild)
      return `${layout.id} #${index} ${child.label ?? child.name}${suffix}`

    return `${layout.id} #${index} ${child.label ?? child.name} #${path.index + 1} ${grandchild.label ?? grandchild.name}${suffix}`
  }

}
