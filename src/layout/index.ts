import type LayoutMeta from '../structs/LayoutMeta'
import type LayoutParameter from '../structs/LayoutParameter'
import type { ListLayoutParameter } from '../structs/LayoutParameter'

import { clone } from '../util'

export interface LayoutOptions {
  id: string
  meta?: LayoutMeta
  params: Map<string, LayoutParameter>
  defaultValues?: any
  template?: any
}

abstract class LayoutBase {

  static _specVersion = 2

  constructor(layout: LayoutOptions) {
    Object.assign(this, layout)
  }

  getDefaultValues(key?: string) {
    let params: Map<string, LayoutParameter>

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

  getListParams(key: string) {
    return (<ListLayoutParameter>this.params.get(key))?.params
  }

  template: any
  component: any

  // render as HTMLElement or something
  abstract render(el: HTMLElement | null, opt: any): unknown
  // render as HTML string (may or may not be hydrated)
  abstract renderToString(opt: any): string
}

interface LayoutBase extends LayoutOptions {}

export default LayoutBase

///

export abstract class DynamicLayoutBase extends LayoutBase {
  override template: (opt: any, ctx: any) => any

  // hydrate above
  hydrate?(el: HTMLElement, opt: any): void
}
