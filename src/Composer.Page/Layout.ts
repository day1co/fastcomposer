import type LayoutMeta from '../Structs/LayoutMeta'
import type LayoutParameter from '../Structs/LayoutParameter'
import type {
  SingularLayoutParameter,
  ListLayoutParameter,
  LegacyLayoutParameter
} from '../Structs/LayoutParameter'

import lotemplate from 'lodash.template'
import { marked } from 'marked'

import Layer from './Layer'

import { clone, uniqueId } from '../Composer/Util'

const paramArrayToMap = (params: Array<LegacyLayoutParameter>):
  Map<string, LayoutParameter> =>
    new Map(params.map(param => [
      param.name,
      param.type === 'list'?
        <ListLayoutParameter>{ ...param, params: paramArrayToMap(param.params) }
      : <SingularLayoutParameter>param
    ]))

const paramMapToArray = (params: Map<string, LayoutParameter>):
  object =>
    [...params.values()].map(param =>
      param.type !== 'list'? param : {
        ...param,
        params: paramMapToArray((<ListLayoutParameter>param).params)
      }
    )

export default class Layout {

  renderer: any

  constructor(
    public readonly id: string,
    public readonly meta: LayoutMeta,
    public readonly params: Map<string, LayoutParameter>,
    public readonly template: any,
    public readonly defaultValues?: { [key: string]: any }
  ) {
    this.renderer = lotemplate(template)
  }

  static fromDefinition({ id, description, params, template, values = null }) {
    // JSON definition were used
    if(Array.isArray(params))
      params = paramArrayToMap(params)

    return new Layout(id, { description }, params, template, values)
  }
  dump() {
    return <ReturnType<typeof Layout.fromDefinition>>clone({
      id: this.id,
      meta: this.meta,
      params: paramMapToArray(this.params),
      template: this.template,
      values: this.defaultValues
    })
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

  render(values: any) {
    return this.renderer({
      $markdown(text) { // FIXME isolate?
        return marked.parse(text)
      },
      ...values
    })
  }
}
