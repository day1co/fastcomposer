import type Action from '../state/action'

import Module from '../state/module'
import Actions from './actions'
import Path from './path'
import Layer from './layer'
import Layout from '../layout'
import LegacyLayout from '../layout/legacy'
import { uniqueId } from '../util'

type LayoutMap = Map<string, Layout>
type LooseLayoutMap = LayoutMap | object

export default class Page extends Module {

  actions: Map<string, Action<Page>>
  state: Array<Layer> = []

  _layouts: Map<string, Layout>

  constructor(
    layouts: Map<string, Layout> | object,
    actions: Map<string, Action<Page>> = Actions
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
      : new Map()

    const result = state.map(layerdef => {
      const { id, layout } = layerdef
      const layoutId = typeof layout === 'string'? layout : layout.id
      const foundLayout = layouts.get(layoutId)

      if(providedLayouts && !foundLayout)
        throw new ReferenceError(`layout '${layoutId}' of layer '${id}' `
          + `couldn't be found from layout list which was provided`)

      // foundLayout will automatically fill missing layout definitions
      // AND prevent re-initialize Layouts, this is bit tricky
      // so TODO: should we consider inconsistent layout defs between layers?
      const layer = Layer.fromDump(layerdef, foundLayout)

      if(!providedLayouts && !foundLayout)
        layouts.set(layer.layout.id, layer.layout)

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

  // state utils

  getLayerByPath(path: Path): Layer | undefined {
    return this.state.find((layer: Layer) => layer.id === path.layer)
  }
  pathToIndex(path: Path): number | undefined {
    const found = this.state.findIndex((layer: Layer) => layer.id === path.layer)
    return found >= 0? found : undefined; // INTENDED
  }
  indexToPath(index: number): Path | undefined {
    return this.state[index]?.path
  }

  // layout

  getLayout(id: string): Layout {
    const layout: Layout | undefined = this._layouts.get(id)
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

    return layer
  }
  restoreLayer(after: Path | undefined, oldLayer: Layer) {
    // FIXME gonna throw them as-is?
    const length = this.state.length
    const index = after? this.pathToIndex(after) ?? length : length

    this.state.splice(index, 0, oldLayer)

    return oldLayer
  }
  duplicateLayer(after: Path, layerId?: string) {
    const index = this.pathToIndex(after)
    if(index == null)
      throw new Error()
    const oldLayer = this.state[index]
    const newLayer = oldLayer.clone(layerId)

    this.state.splice(index + 1, 0, newLayer)

    return newLayer
  }
  reorderLayer(at: Path | number, toWhere: Path | number) {
    const from = typeof at === 'number'? at : this.pathToIndex(at)!
    const to = typeof toWhere === 'number'? toWhere : this.pathToIndex(toWhere)!
    const [ target ] = this.state.splice(from, 1)

    this.state.splice(to, 0, target)

    // kindly tell back as indexes
    return [ from, to ]
  }
  removeLayer(path: Path): number | undefined {
    const index = this.pathToIndex(path) ?? -1
    if(index < 0)
      return

    this.state.splice(index, 1)

    return index
  }

}
