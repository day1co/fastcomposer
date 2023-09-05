import type Action from '../../state/action'
import type Page from '..'

// FIXME: ?????
// './Document.Clear',
import Layer_New from './Layer.New'
import Layer_Remove from './Layer.Remove'
import Layer_Duplicate from './Layer.Duplicate'
import Layer_Reorder from './Layer.Reorder'
import Layer_Edit from './Layer.Edit'
import Layer_Item_New from './Layer.Item.New'
import Layer_Item_Remove from './Layer.Item.Remove'
import Layer_Hide from './Layer.Hide'
// './Layer.Clear'

export default new Map<string, Action<Page>>([
  // Document_Clear
  Layer_New,
  Layer_Remove,
  Layer_Duplicate,
  Layer_Reorder,
  Layer_Edit,
  Layer_Item_New,
  Layer_Item_Remove,
  Layer_Hide
  // Layer_Clear
].map(module => [ module.id, module ])
)
