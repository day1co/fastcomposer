import type Action from '../Composer/IAction'

import Module from '../Composer/Module'
import Actions from './Actions'
import Path from './Path'
import Layer from './Layer'
import Layout from './Layout'

type Layouts = Map<string, Layout>
type LooseLayouts = Layouts | object

export default class Page extends Module {

  actions: Map<string, Action<Page>>
  state: Array<Layer> = []

  _layouts: Map<string, Layout>

  constructor(
    layouts: Map<string, Layout> | object,
    actions: Map<string, Action<Page>> = Actions
  ) {
    super(actions)

    this._layouts = Page.layoutsObjectToMap(layouts)
  }

  static layoutsObjectToMap(layouts: LooseLayouts): Layouts {
    return layouts instanceof Map
     ? layouts
     : new Map(
        Object.entries(layouts)
              .map(([ k, v ]) => Layout.fromDefinition(v))
              .map(layout => [ layout.id, layout ])
      )
  }

  // save/load

  static fromDump(state: Array<any>, providedLayouts?: LooseLayouts) {
    const layouts = providedLayouts !== null
      ? Page.layoutsObjectToMap(providedLayouts)
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
  dump(includeFullLayout = true) {
    return this.state.map(layer => layer.dump(includeFullLayout))
  }
  render() {
    // TODO isolate?
    return this.state.flatMap(layer => [
      `<section class="fc-block fc-layout fc-layout-${layer.layout.id}">`,
      layer.render(),
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
  createLayer(layoutId: string, layerId?: any) {
    return this.getLayout(layoutId).createLayer(layerId)
  }

  // editor actions

  appendLayer(after: Path | undefined, layoutId: string, layerId?: string) {
    const layer = this.createLayer(layoutId, layerId)
    const length = this.state.length
    const index = after? this.pathToIndex(after) ?? length : length

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

  // edit methods (how??)
  // finalizers (save, etc)
  // how the f**k i should handle list args?
}
