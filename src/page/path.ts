import ActTarget from '@day1co/fastcomposer-state/acttarget'

export default class Path implements ActTarget {

  type: 'path' = 'path'

  constructor(
    public layer: string,
    public child?: string, // key
    public index?: number, // list index
    public grandchild?: string
  ) {}

  toString() {
    return this.layer
      + '/' + (this.child ?? '')
      + '#' + (this.index ?? '')
      + '/' + (this.grandchild ?? '')
  }
  isEqual(path: Path) {
    return this.layer === path.layer &&
           this?.child === path?.child &&
           this?.index === path?.index &&
           this?.grandchild === path?.grandchild
  }
  includes(path: Path) {
    return (path.layer === this.layer) &&
           (this.child == null || path?.child === this?.child) &&
           (this.index == null || path?.index === this?.index) &&
           (this.grandchild == null || path?.grandchild === this?.grandchild)
  }
  isSubsetOf(path: Path) {
    return path?.includes?.(this)
  }

  partial(until: string) {
    switch(until) {
      case 'layer':
        return new Path(this.layer)
      case 'child':
        return new Path(this.layer, this.child)
      case 'index':
        return new Path(this.layer, this.child, this.index)
      case 'grandchild': // ???
        return new Path(this.layer, this.child, this.index, this.grandchild)
      default:
        throw new TypeError(`invalid Path#partial option given`)
    }
  }

  override({ layer, child, index, grandchild }:
    { layer?: string, child?: string, index?: number, grandchild?: string}) {

    layer = layer ?? this.layer
    child = child ?? this.child
    if(index != null)
      if(child == null)
      throw new ReferenceError(`tried to set 'index' without 'child'`)
    index = index ?? this.index
    if(grandchild != null)
      if(index == null || child == null)
        throw new ReferenceError(`tried to set 'grandchild' without 'child' and/or 'index'`)
    grandchild = grandchild ?? this.grandchild
    return new Path(layer, child, index, grandchild)
  }

  setChild(child: string) {
    if(this.child != null)
      return this.override({ grandchild: child })
    else
      return this.override({ child })
  }
}

export class Paths implements ActTarget {

  type: 'paths' = 'paths'

  constructor(public paths: Array<Path>) {}

  toString() {
    return this.paths.map(path => path.toString()).join(', ')
  }
  isEqual(paths: Paths) {
    return this.paths.length === paths.paths.length && this.paths.every(path => paths.paths.includes(path))
  }
  includes(paths: Paths) {
    return paths.paths.length === this.paths.length && paths.paths.every(path => this.paths.includes(path))
  }
  isSubsetOf(paths: Paths) {
    return paths.includes(this)
  }

  partial(until: string) {
    return new Paths(this.paths.map(path => path.partial(until)))
  }

  override({ layer, child, index, grandchild }:
    { layer?: string, child?: string, index?: number, grandchild?: string }) {

    return new Paths(this.paths.map(path => path.override({ layer, child, index, grandchild })))
  }

  setChild(child: string) {
    return new Paths(this.paths.map(path => path.setChild(child)))
  }

}

globalThis.Paths = Paths
