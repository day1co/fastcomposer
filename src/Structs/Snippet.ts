import type { LayerMeta } from '../page/layer'

export type SnippetItem = {
  layout: string,
  values: any,
  meta: LayerMeta
}
export type Snippets = {
  title: String,
  layers: Array<SnippetItem>
}

export default Snippets
