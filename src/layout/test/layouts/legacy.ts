import LegacyLayout from '../../legacy'

export default LegacyLayout.fromDefinition({
  id: 'list',
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
          defaultValue: 'DEFAULT_LIST_VALUE'
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
})
