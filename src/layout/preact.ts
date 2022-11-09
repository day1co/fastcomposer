import type { LayoutOptions } from '.'

import renderToString from 'preact-render-to-string'
import preact from 'preact'
import { h, Fragment } from 'preact'

import { DynamicLayoutBase } from '.'

export default class PreactLayout extends DynamicLayoutBase {

  constructor(layout: LayoutOptions) {
    super(layout)

    this.component = opt => h(layout.template, { opt })
  }

  render(el: HTMLElement, opt: any): unknown {
    return preact.render(this.component(opt), el)
  }
  renderToString(opt: any): string {
    return renderToString(this.component(opt))
  }
  hydrate(el: HTMLElement, opt: any): void {
    return preact.hydrate(this.component(opt), el)
  }

}
