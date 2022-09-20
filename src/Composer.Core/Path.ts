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

  override({ layer, child, index, grandchild }) {
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
}
