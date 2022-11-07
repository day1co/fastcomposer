// @ts-nocheck TS2531

import * as setup from './setup'
import PreactLayout from './Layouts/Preact'
import Layer from '../../Composer.Page/Layer'

describe.each([
  [ 'PreactLayout', PreactLayout ]
])('Composer.LayoutBase: $0', () => {

  afterEach(() => setup.globalWindow.clear())

  test('render to string without window', () => {
    setup.globalWindow.clear()
    expect(global).not.toHaveProperty('window')

    const layer = new Layer('test', PreactLayout, setup.opt)

    expect(layer.renderToString()).toBe(setup.expectedString())

    // don't test for mutation heree
    // since we call render() manually it has no meaning at all
  })

  test('render on dom', async () => {
    setup.globalWindow.setup()

    const layer = new Layer('test', PreactLayout, setup.opt)
    const root = document.createElement('div')
    document.body.appendChild(root)
    layer.render(root)

    expect(root.innerHTML).toBe(setup.expectedString())

    expect(document.querySelector('#counter').textContent).toBe('0')

    document.querySelector('#plus')
      .dispatchEvent(new window.MouseEvent('click'))

    await setup.nextTick()

    expect(document.querySelector('#counter').textContent).toBe('1')
  })

  test('render as string, then hydrate later', async () => {
    setup.globalWindow.clear()
    expect(global).not.toHaveProperty('window')

    const layer = new Layer('test', PreactLayout, setup.opt)
    const rendered = layer.renderToString()

    ///

    setup.globalWindow.setup()

    const root = document.createElement('div')
    document.body.appendChild(root)
    root.innerHTML = rendered

    /// should not work before hydration

    document.querySelector('#plus')
      .dispatchEvent(new window.MouseEvent('click'))

    await setup.nextTick()
    expect(document.querySelector('#counter').textContent).toBe('0')

    ///

    layer.hydrate(root)

    expect(document.querySelector('#counter').textContent).toBe('0')

    document.querySelector('#plus')
      .dispatchEvent(new window.MouseEvent('click'))

    await setup.nextTick()

    expect(document.querySelector('#counter').textContent).toBe('1')
  })

})
