import * as setup from './setup'

import Layer from '../Layer'
import Path from '../Path'

describe('Composer.Page: Layer', () => {

  it('should dump/init back and forth', () => {
    const layer = new Layer('test1', setup.ListLayout)
    layer.addItem(new Path('test1', 'list'))
    layer.addItem(new Path('test1', 'list'))

    layer.set(new Path('test1', 'list', 0, 'param1'), 'foo')
    layer.set(new Path('test1', 'list', 1, 'param1'), 'bar')

    const dump = layer.dump()

    expect(dump).toEqual({
      id: 'test1',
      layout: setup.ListLayoutDefinition,
      values: {
        list: [
          { param1: 'foo' },
          { param1: 'bar' }
        ]
      }
    })

    // this also checks for any remaining Map, which shouldn't exist in dump
    const layer2 = Layer.fromDump(dump)
    const dump2 = layer2.dump()
    expect(dump).toEqual(dump2)
  })

})
