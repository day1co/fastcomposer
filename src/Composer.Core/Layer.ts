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
    this.values = values ?? layout.getDefaultValues()
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
  addItemFor({ child }: Path) {
    const def = <ListLayoutParameter>this._getDef(child)
    if(def.type !== 'list')
      throw new TypeError('trying to add item to non-list type item')

    const list = this.values[child]
    // TODO: not to throw?
    if(list.length >= def.maxLength)
      throw new TypeError(`value '${child}' has already exceeded its maxLength`)

    list.push(this.layout.getDefaultValues(child))
  }
  removeItemFor({ child }: Path, at?: number | string) {
    const def = <ListLayoutParameter>this._getDef(child)
    if(def.type !== 'list')
      throw new TypeError('trying to remove item from non-list type item')

    if(at === null) {
      at = child.split('/')[1]
    }

    const list = this.values[child]
    // TODO: not to throw?
    if(list.length - 1 < at)
      throw new TypeError(`value '${child}' has no element at index ${at}`)

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
    const ref = path.slice(0, -1).reduce((p, c) => p?.[c], this.values)
    const [lastKey] = path.slice(-1)
    ref[lastKey] = value
  }
}
