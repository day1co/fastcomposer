export * from '@day1co/fastcomposer-state/test/setup'

import type {
  SingularLayoutParameter,
  ListLayoutParameter,
  LegacyListLayoutParameter
} from '@day1co/fastcomposer-layout/structs/LayoutParameter'
import { LegacyLayout } from '@day1co/fastcomposer-layout/layouts'

export const DEFAULT_VALUE = 'default value'

export const MinimalLayoutDefinition = {
  id: 'test',
  description: 'test layout type 0',
  params: [
    <SingularLayoutParameter>{
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

export const MinimalLayout = LegacyLayout.fromDefinition(MinimalLayoutDefinition)

export const MinimalLayouts = new Map([
  [ MinimalLayout.id, MinimalLayout ]
])

export const MinimalLayoutsAsObject = {
  [MinimalLayout.id]: MinimalLayout
}

///

export const DEFAULT_LIST_VALUE = 'default list value'

export const ListLayoutDefinition = {
  id: 'list',
  description: 'test layout type 1 - includes all possible layout types',
  params: [
    <LegacyListLayoutParameter>{
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
  template: [
    '<% list.forEach((item, index) => { %>',
      'item #<%= index %>: <%= item.param1 %>\n',
    '<% }) %>',
  ].join('')
}

export const ListLayout = LegacyLayout.fromDefinition(ListLayoutDefinition)

export const ListLayouts = new Map([
  [ ListLayout.id, ListLayout ]
])
