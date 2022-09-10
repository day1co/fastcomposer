import type Action from './IAction'

// FIXME: ?????
// './Document.Clear',
import Layer_New from './Layer.New'
import Layer_Remove from './Layer.Remove'
import Layer_Duplicate from './Layer.Duplicate'
import Layer_Reorder from './Layer.Reorder'
import Layer_Edit from './Layer.Edit'
// './Layer.Clear'

export default new Map<string, Action>([
  // Document_Clear
  Layer_New,
  Layer_Remove,
  Layer_Duplicate,
  Layer_Reorder,
  Layer_Edit,
  // Layer_Clear
].map(module => [ module.id, module ])
)