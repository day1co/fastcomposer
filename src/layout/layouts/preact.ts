import type { LayoutOptions } from '../index.ts'

import renderToString from 'preact-render-to-string'
import * as preact from 'preact'
import { h, Fragment } from 'preact'

import { DynamicLayoutBase } from '..'

export default class PreactLayout extends DynamicLayoutBase {

  constructor(layout: LayoutOptions) {
    super(layout)

    this.template = opt => h(layout.template, { opt })
  }

  render(el: HTMLElement, opt: any): unknown {
    return preact.render(this.template(opt, null), el)
  }
  renderToString(opt: any): string {
    return renderToString(this.template(opt, null))
  }
  hydrate(el: HTMLElement, opt: any): void {
    return preact.hydrate(this.template(opt, null), el)
  }

}
