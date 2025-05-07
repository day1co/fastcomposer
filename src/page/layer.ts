import type { ListLayoutParameter } from '@day1co/fastcomposer-layout/structs'
import LayoutBase, { DynamicLayoutBase } from '@day1co/fastcomposer-layout'
import { LegacyLayout } from '@day1co/fastcomposer-layout/layouts'


import Path from './path'
import * as util from './util'

/**
 * Stores miscellaneous attributes of layer. This will be preserved.
 */
export type LayerMeta = {
  hidden: boolean,
  label: string
}
/**
 * Stores temporal states of layer. This won't be saved.
 */
export type LayerStatus = {
  invalid: Array<Path>
}

export default class Layer {
  public values: any
  public status: LayerStatus = {
    invalid: []
  }

  constructor(
    public id: string,
    public layout: LayoutBase,
    values?: any,
    public meta: LayerMeta = {
      hidden: false,
      label: ''
    }
  ) {
    this.values = Object.assign(layout.getDefaultValues(), values ?? {})
  }

  static fromDump(dump: any, layout?: LegacyLayout) { // FIXME: will not work with non-legacy layout
    const { id, uniqueId, layout: layoutFromDump, values, hidden, meta } = dump
    if(!layout)
      layout = LegacyLayout.fromDefinition(layoutFromDump)
    else if(typeof layoutFromDump === 'string')
      void 0 // TODO: assert given layout is same…? shud I?

    return new Layer(id ?? uniqueId, layout, values, {
      hidden: meta?.hidden ?? hidden,
      label: meta?.label ?? ''
    })
  }

  dump(includeLayout = false) {
    return {
      id: this.id,
      layout: includeLayout? this.layout.dump() : this.layout.id,
      values: this.values,
      meta: this.meta,
      hidden: this.meta.hidden
    }
  }
  render(el: any, reportError: boolean = false) {
    try {
      return this.layout.render(el, this.values)
    } catch(e) {
      if(!this.status.invalid.length)
        this.status.invalid.push(new Path(null))
      if(reportError)
        return `<div>${e.message}</div>`
      else
        return ''
    }
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
            util.html.validate(value) || this.path.override({ child, index, grandchild })
          )
        )
      : util.html.validate(value) || [ this.path.override({ child }) ]
    ).filter(v => v instanceof Path)
  }
  updateValidity() {
    return this.status.invalid = this.validate()
  }
  clearState() {
    this.status.invalid = []
  }

  get path() {
    return new Path(this.id)
  }

  clone(id = util.uniqueId()) {
    return new Layer(id, this.layout, structuredClone(this.values))
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
  setMeta<K extends keyof LayerMeta>(key: K, value: LayerMeta[K]) {
    this.meta[key] = value;
  }
}
