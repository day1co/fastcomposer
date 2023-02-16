import type LayoutMeta from '../structs/LayoutMeta'
import type LayoutParameter from '../structs/LayoutParameter'
import type { LayoutOptions } from '.'
import type {
  SingularLayoutParameter,
  ListLayoutParameter,
  LegacyLayoutParameter,
  LegacyListLayoutParameter
} from '../structs/LayoutParameter'

import lotemplate from 'lodash.template'
import { marked } from 'marked'

import LayoutBase from '.'

const paramArrayToMap = (params: Array<LegacyLayoutParameter>):
  Map<string, LayoutParameter> =>
    new Map(params.map(param => [
      param.name,
      param.type === 'list'?
        <ListLayoutParameter>{ ...param, params: paramArrayToMap(param.params) }
      : <SingularLayoutParameter>param
    ]))

/*
const paramMapToArray = (params: Map<string, LayoutParameter>):
  object =>
    [...params.values()].map(param =>
      param.type !== 'list'? param : {
        ...param,
        params: paramMapToArray((<ListLayoutParameter>param).params)
      }
    )
*/

export default class LegacyLayout extends LayoutBase {

  component: ReturnType<typeof lotemplate>

  constructor(layout: LayoutOptions) {
    super(layout)

    this.component = lotemplate(layout.template)
  }

  static fromDefinition({
    id, description, icon, params, template, values = null
  }: {
    id: string,
    description: string,
    icon?: string,
    params: Array<LegacyLayoutParameter> | Map<string, LayoutParameter>,
    template: string,
    values: any
  }) {
    const meta = { description, icon }

    if(Array.isArray(params)) // means JSON definition were used
      params = paramArrayToMap(params)

    return new LegacyLayout({
      id,
      meta,
      params,
      template,
      defaultValues: values
    })
  }

  render(el, opt: any): string {
    return this.renderToString(opt)
  }
  renderToString(opt: any): string {
    return this.component({
      // FIXME isolate somewhere out
      $markdown: text => marked.parse(text),
      ...opt
    })
  }
}
