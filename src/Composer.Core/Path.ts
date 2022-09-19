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
}
