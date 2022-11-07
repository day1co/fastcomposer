import type { ListLayoutParameter } from '../Structs/LayoutParameter'
import LayoutBase, { DynamicLayoutBase } from '../Composer.Layout/Base'

import Path from './Path'
import { clone, uniqueId } from '../Composer/Util'

export default class Layer {
  public values: any

  constructor(
    public id: string,
    public layout: LayoutBase,
    values?: any
  ) {
    this.values = values ?? layout.getDefaultValues()
  }

  static fromDump(
    { id, values }: { id: string, values: any },
    layout: LayoutBase
  ) {
    return new Layer(id, layout, values)
  }

  dump() {
    return {
      id: this.id,
      layout: this.layout.id,
      values: this.values
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
    const def = <ListLayoutParameter>this._getDef(child)
    if(def.type !== 'list')
      throw new TypeError('trying to add item to non-list type item')

    const list = this.values[child]
    // TODO: not to throw?
    if(list.length >= def.maxLength)
      throw new TypeError(`value '${child}' has already exceeded its maxLength`)

    list.splice(index ?? list.length, 0, state ?? this.layout.getDefaultValues(child))
  }
  removeItem({ child, index }: Path, at: number | string = index) {
    const def = <ListLayoutParameter>this._getDef(child)
    if(def.type !== 'list')
      throw new TypeError('trying to remove item from non-list type item')

    const list = this.values[child]
    // TODO: not to throw?
    if(list.length - 1 < at)
      throw new TypeError(`value '${child}' has no element at index ${at}`)

    list.splice(at, 1)
  }

  get({ child, index, grandchild }: Path) {
    if(grandchild != null && index != null)
      return this.values[child][index][grandchild]
    else if(index != null)
      return this.values[child][index]
    else if(child != null)
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
