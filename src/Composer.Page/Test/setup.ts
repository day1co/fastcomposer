export * from '../../Composer/Test/setup'

import Layout from '../../Composer.Page/Layout'

export const DEFAULT_VALUE = 'default value'

export const MinimalLayoutDefinition = {
  id: 'test',
  description: 'test layout type 0',
  params: [
    {
      name: 'param1',
      type: 'text',
      description: 'text'
    }
  ],
  values: {
    param1: DEFAULT_VALUE
  },
  template: '<%= param1 %>'
}

export const MinimalLayout = Layout.fromDefinition(MinimalLayoutDefinition)

export const MinimalLayouts = new Map([
  [ MinimalLayout.id, MinimalLayout ]
])

export const MinimalLayoutsAsObject = {
  [MinimalLayout.id]: MinimalLayout
}

///

export const DEFAULT_LIST_VALUE = 'default list value'

export const ListLayout = Layout.fromDefinition({
  id: 'test',
  description: 'test layout type 1 - includes all possible layout types',
  params: [
    {
      name: 'list',
      type: 'list',
      description: 'list',
      maxLength: 3,
      params: [
        {
          name: 'param1',
          type: 'string',
          description: 'test',
          defaultValue: DEFAULT_LIST_VALUE
        }
      ]
    }
  ],
  values: {
    list: []
  },
  template: `
    <% list.forEach((item, index) => { %>
      item #<%= index %>: <%= item %>
    <% }); %>`.replace(/(?:^\s*\r?\n|\s*\r?(\n)\s*)/gm, '$1')
})
