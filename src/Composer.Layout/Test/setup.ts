import globalJsdom from 'global-jsdom'

export const opt = {
  list: [
    { 'param1': 'first item' },
    { 'param1': 'second item' },
    { 'param1': 'third item' }
  ]
}

export const stripIndent = string => string.join().replace(/(^|\n)\s*/g, '')

export const expectedString = () => stripIndent`
<p>
  Counter: <span id="counter">0</span><button id="plus">+</button>
</p>
<ul>
  <li> item #1: first item </li>
  <li> item #2: second item </li>
  <li> item #3: third item </li>
</ul>
`


export const globalWindow = {
  _cleanup: null,
  setup(body = '') {
    this.clear()
    this._cleanup = globalJsdom(body, {
      resources: 'usable',
      runScripts: 'dangerously'
    })
  },
  clear() {
    this._cleanup?.()
    this._cleanup = null
  }
}

export const nextTick = () => new Promise<void>((resolve, reject) =>
  setTimeout(() => resolve(), 0)
)
