import { h, Fragment } from 'preact'
import * as preactHooks from 'preact/hooks'

import PreactLayout from '../../src/layout/preact'

export default new PreactLayout({
  id: 'counter',
  meta: {
    description: 'preact counter test layout'
  },
  params: new Map([
    [ 'background', {
      type: 'text',
      description: 'background color'
    }]
  ]),
  template: ({ opt, ctx }) => {
    const [value, setValue] = preactHooks.useState(0)
    const adjust = d => preactHooks.useCallback(() => setValue(value + d), [value])

    return <div style={{ color: opt.background }}>
      <p>
        Counter: <span id="counter">{value}</span>
        <button id="minus" onClick={adjust(-1)}>-</button>
        <button id="plus" onClick={adjust(+1)}>+</button>
      </p>
    </div>
  },
})
