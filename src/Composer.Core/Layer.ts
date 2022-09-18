import type Act from './Act'
import type ListLayoutParameter from './Structs/ListLayoutParameter'
import type Path from './Structs/Path'
import type Layout from './Layout'

import { clone, uniqueId } from './Util'

export default class Layer {
  public values: any

  constructor(
    public id: string,
    public layout: Layout,
    values: any
  ) {
    if(values == null)
      values = layout.getDefualtValues()
  }

  get path() {
    return <Path>{ layer: this.id }
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
  addItemFor(key: string) {
    const def = <ListLayoutParameter>this._getDef(key)
    if(def.type !== 'list')
      throw new TypeError('trying to add item to non-list type item')

    const list = this.values[key]
    // TODO: not to throw?
    if(list.length >= def.maxLength)
      throw new TypeError(`value '${key}' has already exceeded its maxLength`)

    list.push(this.layout.getDefualtValues(key))
  }
  removeItemFor(key: string, at: number) {
    const def = <ListLayoutParameter>this._getDef(key)
    if(def.type !== 'list')
      throw new TypeError('trying to remove item from non-list type item')

    const list = this.values[key]
    // TODO: not to throw?
    if(list.length - 1 < at)
      throw new TypeError(`value '${key}' has already exceeded its maxLength`)

    list.slice(at, 1)
  }

  get({ child }: Path) {
    const path = child?.split('/') ?? []
    const ref = path.reduce((p, c) => p?.[c], this.values)
    return ref
  }
  set({ child }: Path, value: any) {
    if(!child)
      throw new ReferenceError('attempted to set nowhere on layer')
    const path = child.split('/')
    const ref = path.slice(-1).reduce((p, c) => p?.[c], this.values)
    const [lastKey] = path.slice(-1)
    ref[lastKey] = value
  }
}
