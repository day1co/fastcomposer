import type Act from './Act'
import type Path from './Structs/Path'
import type Layout from './Layout'

import { clone, uniqueId } from './Util'

export default class Layer {

  constructor(
    public id: string,
    public layout: Layout,
    public values: any
  ) {}

  getValueByPath(path: Path) {
    if(!path.child)
      throw new ReferenceError('no child in path given')
    
    const objpath = path.child.split('.')
    return objpath.reduce((p, c) => p?.[c], this.values)
  }
  setValueByPath(path: Path, value: any) {
    if(!path.child)
      throw new ReferenceError('no child in path given')
  
    const objpath = path.child.split('.')
    const ref = objpath.slice(0, -1).reduce((p, c) => p?.[c], this.values)
    const [lastKey] = objpath.slice(-1)
    ref[lastKey] = value
  }

  get path() {
    return <Path>{ layer: this.id }
  }

  clone(id = uniqueId()) {
    return new Layer(id, this.layout, clone(this.values))
  }
  get({ child }: Path) {
    const path = child?.split('/') ?? []
    const ref = path.reduce((p, c) => p?.[c], this.values)
    return ref
  }
  set({ child }: Path, value: any) {
    if(!child)
      throw new ReferenceError('attempted to set nowhere on layer')
    const path = child.split('/')
    const ref = path.slice(-1).reduce((p, c) => p?.[c], this.values)
    const [lastKey] = path.slice(-1)
    ref[lastKey] = value
  }
}
