import type { LayoutMeta, LayoutParameter, ListLayoutParameter } from './structs'

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
    if(!(layout.params instanceof Map)) {
      this.params = new Map(Object.entries(layout.params))
    }
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
      return structuredClone(this.defaultValues)
    }

    const entries = [ ...params.entries() ]

    return Object.fromEntries(entries.map(([ k, v ]) => [
      k,
      v.defaultValue ?? (v.type === 'list'? [] : '')
    ]))
  }

  dump() {
    return {
      id: this.id,
      meta: this.meta,
      params: Object.fromEntries([...this.params.entries()].map(([key, item]) => {
        if(item.type === 'list') {
          const params = Object.fromEntries(item.params.entries())
          return [ key, { ...item, params } ]
        } else {
          return [ key, item ]
        }
      })),
      defaultValues: this.defaultValues,
      template: this.template
    }
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
  template: (opt: any, ctx: any) => any = null

  // hydrate above
  hydrate?(el: HTMLElement, opt: any): void
}
