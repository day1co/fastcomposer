import * as setup from './setup'

import Layout from '../Layout'

describe('Composer.Page: Layout', () => {

  it('should dump/init back and forth', () => {
    const def = setup.MinimalLayoutDefinition

    const layout = Layout.fromDefinition(def)
    const dump = layout.dump()
    expect(dump).toEqual(def)

    const layout2 = Layout.fromDefinition(dump)
    const dump2 = layout2.dump()
    // this also checks for any remaining Map, which shouldn't exist in dump
    expect(dump).toEqual(dump2)
  })

  it.each([
    [
      'MinimalLayout',
      setup.MinimalLayout,
      { param1: 'TEST' },
      'TEST'
    ], [
      'ListLayout',
      setup.ListLayout,
      { list: [ { param1: 'foo' }, { param1: 'bar' } ] },
      `item #0: foo\nitem #1: bar\n`
    ]
  ])('should render layouts w/ %s', (id, layout, value, expected) => {
    expect(layout.render(value)).toEqual(expected)
  })

})
