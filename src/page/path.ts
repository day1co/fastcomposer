export default class Path {
  constructor(
    public layer: string,
    public child?: string, // key
    public index?: number, // list index
    public grandchild?: string
  ) {}

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

  withChild(child: string) {
    if(this.child == null) {
      return this.partial('layer').override({ child })
    } else if(this.index != null && this.grandchild == null) {
      return this.partial('index').override({ grandchild: child })
    } else {
      return this
    }
  }
}
