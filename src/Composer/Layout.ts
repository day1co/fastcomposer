import type LayoutParameter from './Structs/LayoutParameter'
import type { SingularLayoutParameter } from './Structs/LayoutParameter'
import type ListLayoutParameter from './Structs/ListLayoutParameter'
import type LegacyLayoutParameter from './Structs/LegacyLayoutParameter'

import Layer from './Layer'

import { clone, uniqueId } from './Util'

const paramArrayToMap = (params: Array<LegacyLayoutParameter>):
  Map<string, LayoutParameter> =>
    new Map(params.map(param => [
      param.name,
      param.type === 'list'?
        <ListLayoutParameter>{ ...param, params: paramArrayToMap(param.params) }
      : <SingularLayoutParameter>param
    ]))

export default class Layout {

  constructor(
    public readonly id: string,
    public readonly description: string,
    public readonly params: Map<string, LayoutParameter>,
    public readonly defaultValues?: { [key: string]: any }
  ) {}

  static fromDefinition({ id, description, params, values = null }) {
    // JSON definition were used
    if(Array.isArray(params))
      params = paramArrayToMap(params)

    return new Layout(id, description, params, values)
  }

  get layout() {
    return <Layout>{
      id: this.id,
      description: this.description,
      params: this.params
    }
  }

  createLayer(id: string = uniqueId(), existingValue?: any): Layer {
    return new Layer(id, this, existingValue ?? this.getDefaultValues())
  }

  getDefaultValues(key?: string) {
    let params

    if(key) {
      const ldef = <ListLayoutParameter>this.params.get(key)
      if(!ldef || ldef.type !== 'list')
        throw new ReferenceError(`given key ${key} does not exist, or not a list`)

      params = ldef.params
    } else if(!this.defaultValues) {
      params = this.params
    } else {
      return clone(this.defaultValues)
    }

    const entries = [ ...params.entries() ]

    return Object.fromEntries(entries.map(([ k, v ]) => [
      k,
      v.defaultValue ?? (v.type === 'list'? [] : '')
    ]))
  }
}
