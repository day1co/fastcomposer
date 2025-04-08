import type Action from '../../state/action'
import type ActTarget from '../../state/acttarget'
import type Page from '..'

// FIXME: ?????
// './Document.Clear',
import Layer_New from './Layer.New'
import Layer_Restore from './Layer.Restore'
import Layer_Remove from './Layer.Remove'
import Layer_Duplicate from './Layer.Duplicate'
import Layer_Reorder from './Layer.Reorder'
import Layer_Edit from './Layer.Edit'
import Layer_Edit_Meta from './Layer.Edit.Meta'
import Layer_Item_New from './Layer.Item.New'
import Layer_Item_Remove from './Layer.Item.Remove'
import Layer_Hide from './Layer.Hide'
// './Layer.Clear'

// type ExtractGenerics<P> = P extends Action<infer T, infer U> ? [T, U] : never;

export default new Map([
  // Document_Clear
  Layer_New,
  Layer_Restore,
  Layer_Remove,
  Layer_Duplicate,
  Layer_Reorder,
  Layer_Edit,
  Layer_Edit_Meta,
  Layer_Item_New,
  Layer_Item_Remove,
  Layer_Hide
  // Layer_Clear
].map(module => <const>[ module.id, module ]))
