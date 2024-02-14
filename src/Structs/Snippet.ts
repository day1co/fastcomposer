export type SnippetItem = {
  layout: string,
  values: any
}
export type Snippets = {
  title: String,
  layers: Array<SnippetItem>
}

export default Snippets
