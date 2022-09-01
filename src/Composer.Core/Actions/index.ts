export default new Map([
  // './Document.Clear',
  './Layer.New',
  './Layer.Remove',
  './Layer.Duplicate',
  './Layer.Reorder',
  './Layer.Edit',
  // './Layer.Clear'
].map(path => require(path).default)
 .map(module => [ module.id, module ])
)