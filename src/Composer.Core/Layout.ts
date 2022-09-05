import type LayoutParameter from './Structs/LayoutParameter'

import Layer from './Layer'

import uniqueId from './Util/uniqueId'
import clone from './Util/clone'

export default class Layout {
  constructor(
    public readonly id: string,
    public readonly description: string,
    /* TODO:
     - use Map instead of Array
     - then... add 'payload order'? or just trust Map's ordering?
     */
    public readonly params: Array<LayoutParameter>
  ) {}

  static fromDefinition({ id, description, params }: Layout) {
    return new Layout(id, description, params)
  }

  get layout() {
    return <Layout>{
      id: this.id,
      description: this.description,
      params: this.params 
    }
  }

  createLayer(id: string = uniqueId(), existingValue?: any): Layer {
    return new Layer(id, this, existingValue ?? clone(this.layout.params))
  }
}
