import { h, Fragment } from 'preact'
import preactHooks from 'preact/hooks'

import PreactLayoutBase from '../../layouts/preact'

export default new PreactLayoutBase({
  id: 'preact-example',
  meta: {
    description: 'preact example'
  },
  params: new Map([
    [ 'list', {
      type: 'list',
      description: 'list',
      maxLength: 3,
      params: new Map([
        [ 'param1', {
          type: 'string',
          description: 'content',
          defaultValue: 'DEFAULT_LIST_VALUE'
        } ]
      ])
    }]
  ]),
  template: ({ opt, ctx }) => {
    const [value, setValue] = preactHooks.useState(0)
    const incr = preactHooks.useCallback(() => setValue(value + 1), [value])

    return <>
      <p>
        Counter: <span id="counter">{value}</span>
        <button id="plus" onClick={incr}>+</button>
      </p>
      <ul>
        {opt.list.map((item, index) =>
          <li> item #{index+1}: {item.param1} </li>
        )}
      </ul>
    </>
  },
})
