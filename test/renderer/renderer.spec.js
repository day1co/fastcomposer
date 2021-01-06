const { render } = require('../../src/renderer');

describe('renderer', () => {
  test('should work!', () => {
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
        template:
          '<img src="<%= src %>" <% if(alt){ %>alt="<%= alt %>"\n  <% } %>\n     <% if(width){ %>width="<%= width %>"\n  <% } %>\n     <% if(height){ %>height="<%= height %>"\n  <% } %>\n>\n\n',
        style: '.fc-layout-image img {\n  border: 1px solid blue; }\n',
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
    ];
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
        layout: 'markdown',
        values: {
          content: 'may the **markdown** be with you!',
        },
      },
    ];
    const html = render(layouts, layers);
    expect(html.replace(/\s/g, '')).toEqual(
      `
 <section class="fc-block fc-layout fc-layout-heading">
   <h1>제목</h1>
 </section>
 <section class="fc-block fc-layout fc-layout-paragraph">
   <p>본문</p>
 </section>
 <section class="fc-block fc-layout fc-layout-image">
   <img src="https://via.placeholder.com/320x320.png/00c" alt="simple image" width="320" height="320">
 </section>
 <section class="fc-block fc-layout fc-layout-html">
   <h1>hello</h1><p>world</p>
 </section>
 <section class="fc-block fc-layout fc-layout-markdown">
   <p>may the <strong>markdown</strong> be with you!</p>
 </section>
    `.replace(/\s+/g, '')
    );
  });
});
