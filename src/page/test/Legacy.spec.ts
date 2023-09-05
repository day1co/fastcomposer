import Page from '..';

const layouts = [
  {
    id: 'heading',
    icon: 'icon.svg',
    description: '단순 제목',
    params: [
      {
        name: 'title',
        type: 'text',
        description: 'title text',
      },
    ],
    values: {
      title: '제목',
    },
    template: '<h1><%= title %></h1>\n\n',
    style: '.fc-layout-heading h1 {\n  color: red; }\n',
  },
  {
    id: 'html',
    icon: 'icon.svg',
    description: 'html',
    params: [
      {
        name: 'content',
        type: 'textarea',
        description: 'raw html content',
      },
    ],
    values: {
      content: '<h1>hello</h1><p>world</p>',
    },
    template: '<%= content %>\n\n',
    style: '',
  },
  {
    id: 'image',
    icon: 'icon.svg',
    description: '단순 이미지',
    params: [
      {
        name: 'src',
        type: 'image',
        description: 'image url',
      },
      {
        name: 'width',
        type: 'number',
        description: 'image width(pixel)',
      },
      {
        name: 'height',
        type: 'number',
        description: 'image height(pixel)',
      },
      {
        name: 'alt',
        type: 'string',
        description: 'alternative text',
      },
    ],
    values: {
      src: 'https://via.placeholder.com/320x320.png/00c',
      width: '320',
      height: '320',
      alt: 'simple image',
    },
    // i've tried to keep those testcases as original as possible,
    // but cleaned (only) this up, since it was full of whitespace junk, so
    // debugging about existence of whitespace within this piece of legacy
    // (while results are only shown via jest 'Excepted' single line logs)
    // was literally a pain thru the ass. i'd just avoided it. ¯\_(ツ)_/¯
    template:
      `<img
        src="<%= src %>"
        <% if(alt){ %> alt="<%= alt %>" <% } %>
        <% if(width){ %> width="<%= width %>" <% } %>
        <% if(height){ %> height="<%= height %>" <% } %>>`,
    style: '.fc-layout-image img {\n  border: 1px solid blue; }\n',
  },
  {
    id: 'list',
    icon: 'icon.svg',
    description: '리스트형',
    params: [
      {
        name: 'title',
        type: 'text',
        description: 'title text',
        isRequired: true
      },
      {
        name: 'cards',
        type: 'list',
        description: '추가/삭제를 이용하여 원하는 만큼 카드 리스트를 구현 할 수 있습니다.',
        maxLength: 3,
        params: [
          {
            name: 'src',
            type: 'image',
            description: 'image url',
            defaultValue: 'https://via.placeholder.com/320x320.png/00c',
            isRequired: true
          },
          {
            name: 'width',
            type: 'number',
            description: 'image width(pixel)',
            defaultValue: '320',
            isRequired: true
          },
          {
            name: 'height',
            type: 'number',
            description: 'image height(pixel)',
            defaultValue: '320',
            isRequired: true
          },
          {
            name: 'alt',
            type: 'text',
            description: 'alternative text',
            defaultValue: '설명'
          }
        ]
      }
    ],
    values: {
      title: '제목',
      cards: []
    },
    template:
      `<h1>
        <div>
          <%= title %>
          이것은 리스트 레이아웃을 테스트합니다.
        </div>
        <% cards.forEach((item) => { %>
          <div><img src="<%= item.src %>"/></div>
          <div><%= item.width %></div>
          <div><%= item.height %></div>
          <div><%= item.alt %></div>
        <% }); %>
      </h1>`,
    style:
     `.fc-layout-list h1 { display: flex; }
      .fc-layout-list h1 div { color: red; }
      @media screen and (max-width: 599px) {
        .fc-layout-list h1 { flex-direction: column; }
      }
      @media screen and (min-width: 600px) and (max-width: 959px) {
        .fc-layout-list h1 { flex-direction: column; }
      }
      @media screen and (min-width: 960px) {
        .fc-layout-list h1 {
          flex-direction: row;
        }
      }`
  },
  {
    id: 'markdown',
    icon: 'icon.svg',
    description: 'markdown',
    params: [
      {
        name: 'content',
        type: 'textarea',
        description: 'markdown content',
      },
    ],
    values: {
      content: 'may the **markdown** be with you!',
    },
    template: '<%= $markdown(content) %>\n\n',
    style: '',
  },
  {
    id: 'paragraph',
    icon: 'icon.svg',
    description: '단순 본문',
    params: [
      {
        name: 'content',
        type: 'textarea',
        description: 'paragraph text',
      },
    ],
    values: {
      content: '본문',
    },
    template: '<p><%= content %></p>\n\n',
    style: '.fc-layout-paragraph p {\n  color: red; }\n',
  },
]

const layers = [
  {
    id: 'fc-block-1',
    layout: 'heading',
    values: {
      title: '제목',
    },
  },
  {
    id: 'fc-block-2',
    layout: 'paragraph',
    values: {
      content: '본문',
    },
  },
  {
    id: 'fc-block-3',
    layout: 'image',
    values: {
      src: 'https://via.placeholder.com/320x320.png/00c',
      width: '320',
      height: '320',
      alt: 'simple image',
    },
  },
  {
    id: 'fc-block-4',
    layout: 'html',
    values: {
      content: '<h1>hello</h1><p>world</p>',
    },
  },
  {
    id: 'fc-block-5',
    layout: 'list',
    values: {
      title: '제목',
      cards: [
        {
          src: 'https://via.placeholder.com/320x320.png/00c',
          width: '320',
          height: '320',
          alt: '설명'
        },
        {
          src: 'https://via.placeholder.com/320x320.png/00c',
          width: '320',
          height: '320',
          alt: '설명'
        }
      ]
    }
  },
  {
    id: 'fc-block-6',
    layout: 'markdown',
    values: {
      content: 'may the **markdown** be with you!',
    },
  },
]

const reference = `
<section class="fc-block fc-layout fc-layout-heading">
  <h1>제목</h1>
</section>
<section class="fc-block fc-layout fc-layout-paragraph">
  <p>본문</p>
</section>
<section class="fc-block fc-layout fc-layout-image">
  <img src="https://via.placeholder.com/320x320.png/00c" alt="simple image" width="320" height="320" >
</section>
<section class="fc-block fc-layout fc-layout-html">
  <h1>hello</h1><p>world</p>
</section>
<section class="fc-block fc-layout fc-layout-list">
  <h1>
    <div>
      제목
      이것은 리스트 레이아웃을 테스트합니다.
    </div>
    <div><img src="https://via.placeholder.com/320x320.png/00c"/></div>
    <div>320</div>
    <div>320</div>
    <div>설명</div>
    <div><img src="https://via.placeholder.com/320x320.png/00c"/></div>
    <div>320</div>
    <div>320</div>
    <div>설명</div>
  </h1>
</section>
<section class="fc-block fc-layout fc-layout-markdown">
  <p>may the <strong>markdown</strong> be with you!</p>
</section>
`

describe(`Legacy test cases from 'renderer'`, () => {

  test(`'should work!', as someone wrote in 2019`, () => {

    const page = Page.fromDump(layers, layouts)
    const html = page.render()

    expect(html.replace(/\s\s*/g, ' ')).toEqual(
      reference.replace(/\s\s*/g, ' ').trim()
    )
  })

})
