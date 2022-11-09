import Path from "../path"

describe('Composer.Page: Path descriptor', () => {

  it('should check equality exactly by .isEqual()', () => {
    const p1 = new Path('layer')
    const p2 = new Path('layer', 'child')
    const p3 = new Path('layer', 'child', 0)
    const p4 = new Path('layer', 'child', 0, 'grandchild')
    const pl = [p1, p2, p3, p4]

    for(const ix in pl) {
      const x = pl[ix]
      for(const iy in pl) {
        const y = pl[iy]
        expect(x.isEqual(y)).toEqual(ix === iy)
      }
    }
  })

  it('should return partial path by .partial()', () => {
    const p1 = new Path('layer')
    const p2 = new Path('layer', 'child')
    const p3 = new Path('layer', 'child', 0)
    const p4 = new Path('layer', 'child', 0, 'grandchild')

    expect(p4.partial('layer')).toEqual(p1)
    expect(p4.partial('child')).toEqual(p2)
    expect(p4.partial('index')).toEqual(p3)
    expect(p4.partial('grandchild')).toEqual(p4) // why?
    expect(() => p4.partial('foo')).toThrowError()
  })

  it('should throw with invalid .override()', () => {
    const p1 = new Path('layer')
    const p2 = new Path('layer', 'child')
    const p3 = new Path('layer', 'child', 0)
    const p4 = new Path('layer', 'child', 0, 'grandchild')

    const u1 = { 'layer': 'layer2' }
    const u2 = { 'child': 'child2' }
    const u3 = { 'index': 1 }
    const u4 = { 'grandchild': 'grandchild2' }

    expect(() => p1.override({ ...u3 })).toThrowError()
    expect(() => p1.override({ ...u4 })).toThrowError()
    expect(() => p1.override({ ...u3, ...u4 })).toThrowError()
    expect(() => p1.override({ ...u2, ...u3, ...u4 })).not.toThrowError()

    expect(() => p2.override({ ...u3 })).not.toThrowError()
    expect(() => p2.override({ ...u4 })).toThrowError()
    expect(() => p2.override({ ...u3, ...u4 })).not.toThrowError()

    expect(() => p3.override({ ...u4 })).not.toThrowError()

    expect(() => p4.override({ ...u4 })).not.toThrowError()
  })

  it('should not throw with valid .override()', () => {
    const p1 = new Path('layer')
    const p2 = new Path('layer', 'child')
    const p3 = new Path('layer', 'child', 0)
    const p4 = new Path('layer', 'child', 0, 'grandchild')

    const u1 = { 'layer': 'layer2' }
    const u2 = { 'child': 'child2' }
    const u3 = { 'index': 1 }
    const u4 = { 'grandchild': 'grandchild2' }

    expect(p4.override(u1))
      .toEqual(new Path('layer2', 'child', 0, 'grandchild'))
    expect(p4.override(u2))
      .toEqual(new Path('layer', 'child2', 0, 'grandchild'))
    expect(p4.override(u3))
      .toEqual(new Path('layer', 'child', 1, 'grandchild'))
    expect(p4.override(u4))
      .toEqual(new Path('layer', 'child', 0, 'grandchild2'))

    expect(p3.override(u4))
      .toEqual(new Path('layer', 'child', 0, 'grandchild2'))

    expect(p2.override(u3))
      .toEqual(new Path('layer', 'child', 1))
    expect(p2.override({ ...u3, ...u4 }))
      .toEqual(new Path('layer', 'child', 1, 'grandchild2'))

    expect(p1.override(u2))
      .toEqual(new Path('layer', 'child2'))
    expect(p1.override({ ...u2, ...u3 }))
      .toEqual(new Path('layer', 'child2', 1))
    expect(p1.override({ ...u2, ...u3, ...u4 }))
      .toEqual(new Path('layer', 'child2', 1, 'grandchild2'))
  })
})
