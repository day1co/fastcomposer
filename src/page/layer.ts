import type LayoutParameter from '../structs/LayoutParameter'
import type { ListLayoutParameter } from '../structs/LayoutParameter'
import LayoutBase, { DynamicLayoutBase } from '../layout'
import LegacyLayout from '../layout/legacy'

import Path from './path'
import { clone, uniqueId } from '../util'
import * as html from '../util/html'

export type LayerMeta = {
  hidden: Boolean,
  invalid: Array<Path>
}

export default class Layer {
  public values: any

  constructor(
    public id: string,
    public layout: LayoutBase,
    values?: any,
    public meta: LayerMeta = {
      hidden: false,
      invalid: []
    }
  ) {
    this.values = values ?? layout.getDefaultValues()
  }

  static fromDump(dump: any, layout?: LegacyLayout) { // FIXME: will not work with non-legacy layout
    const { id, uniqueId, layout: layoutFromDump, values, hidden } = dump
    if(!layout)
      layout = LegacyLayout.fromDefinition(layoutFromDump)
    else if(typeof layoutFromDump === 'string')
      void 0 // TODO: assert given layout is same…? shud I?

    return new Layer(id ?? uniqueId, layout, values, { hidden, invalid: [] })
  }

  dump(includeLayout = false) {
    return {
      id: this.id,
      layout: includeLayout? this.layout.dump() : this.layout.id,
      values: this.values,
      hidden: this.meta.hidden
    }
  }
  render(el: any) {
    return this.layout.render(el, this.values)
  }
  renderToString() {
    return this.layout.renderToString(this.values)
  }
  hydrate(el: any) {
    return (<DynamicLayoutBase>this.layout)?.hydrate(el, this.values)
  }

  validate() {
    return <Array<Path>>Object.entries(this.values).flatMap(([ child, value ]) =>
      Array.isArray(value)?
        value.flatMap((item, index) =>
          Object.entries(item).map(([ grandchild, value ]) =>
            html.validateLegacy(value) || this.path.override({ child, index, grandchild })
          )
        )
      : html.validateLegacy(value) || [ this.path.override({ child }) ]
    ).filter(v => v instanceof Path)
  }
  updateValidity() {
    return this.meta.invalid = this.validate()
  }
  clear() {
    this.meta.invalid = []
  }

  get path() {
    return new Path(this.id)
  }

  clone(id = uniqueId()) {
    return new Layer(id, this.layout, clone(this.values))
  }

  _getDef(key: string) {
    const def = this.layout.params.get(key)
    if(!def)
      throw new ReferenceError(`layer param ${key} does not exist`)

    return def
  }
  addItem({ child, index }: Path, state?: any) {
    const def = <ListLayoutParameter>this._getDef(child!)
    if(def.type !== 'list')
      throw new TypeError('trying to add item to non-list type item')

    const list = this.values[child]
    // TODO: not to throw?
    if(list.length >= def.maxLength)
      throw new TypeError(`value '${child}' has already exceeded its maxLength`)

    list.splice(index ?? list.length, 0, state ?? this.layout.getDefaultValues(child))
  }
  removeItem({ child, index }: Path, at: number = index!) {
    const def = <ListLayoutParameter>this._getDef(child!)
    if(def.type !== 'list')
      throw new TypeError('trying to remove item from non-list type item')

    const list = this.values[child!]
    // TODO: not to throw?
    if(list.length - 1 < at)
      throw new TypeError(`value '${child}' has no element at index ${at}`)

    list.splice(at, 1)
  }

  get({ child, index, grandchild }: Path) {
    if(child != null)
      if(index != null)
        if(grandchild != null)
          return this.values[child][index][grandchild]
        else
          return this.values[child][index]
      else
        return this.values[child]
    else
      throw new ReferenceError('attempted to get nowhere on layer')
  }
  set({ child, index, grandchild }: Path, value: any) {
    if(grandchild != null && index != null)
      this.values[child][index][grandchild] = value
    else if(index != null)
      this.values[child][index] = value
    else if(child != null)
      this.values[child] = value
    else
      throw new ReferenceError('attempted to set nowhere on layer')
  }
}
