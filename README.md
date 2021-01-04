[![github version](https://img.shields.io/github/release/fastcampusgit/fastcomposer.svg)](https://github.com/fastcampusgit/fastcomposer/releases/latest)
[![npm version](https://img.shields.io/npm/v/@fastcampus/fastcomposer.svg)](https://www.npmjs.com/package/@fastcampus/fastcomposer)
![FASTCOMPOSER-Test](https://github.com/fastcampus/fastcomposer/workflows/FASTCOMPOSER-Test/badge.svg?branch=develop)

# FAST COMPOSER

a layout based WYSIWYG html editor.

## Table Contents

- [Project setup](#Project-setup)
- [Features](#Features)
- [설치](#설치)
- [사용하기](#사용하기-Vuejs)

## Project setup

```console
$ npm install
```

#### Compiles and generates commonjs/umd bundle

```console
$ npm run bundle
```

#### Compiles and hot-reloads for sample app

```console
$ npm run serve
```

#### Compiles and minifies for sample app

```console
$ npm run build
```

#### Run your tests

```console
$ npm run test
```

#### Lints and fixes files

```console
$ npm run lint
```

#### Build **sample** layouts

```console
$ npm run build-layouts
```

## Features

- Layer Preview
  - desktop(960 ~ (100%))
  - tablet(959px ~ 600px)
  - mobile(599px ~)
- Layer Manager
- Simple HTML Validator

## 설치

```console
$ npm install --save @fastcampus/fastcomposer
```

## 사용하기-Vuejs

```jsx
<template>
  <composer @save="onSave"/>
</template>

<script>
import Composer from 'your-path/fastcomposer/src/views/composer';
import 'your-path-to-layouts-style.css';

export default {
  name: 'yourApp',
  methods: {
    onSave(html, json) {
      // ...
    }
  }
}
</script>

```

### Properties
| Name | Type | Default | Optional | Description |
|---|---|---|---|---|
| layoutModels | Array | [] | No | @fastcampus/layouts list를 넣어준다 |
| layerModals | Array | [] | Yes |서버로부터 저장된 layer data 가 존재한다면 이곳에 넣어준다. |


### Events
#### @save

컴포저 저장시 동작한다.
##### Parameters
* html: `string` composer로 제작된 html
* json: `object` layer 설정 값

#### @uploadFile
템플릿에서 파일 업로드 속성이 존재하는 경우 동작한다.
```html
<composer @uploadFile="onUpload">
```
```javascript
methods: {
  async onUpload(fileInfo, callback) {
    const res = await uploadToYourServer(fileInfo);
    // callback으로 결과를 넘겨준다 (res.url)
    callback(res);
  }
}
```
##### Parameters
* fileInfo: `File`
* callback: `function` 업로드된 이미지를 컴포저에 반영을 위해 실행


### methods

#### 레이어 데이터 설정
```js
// 서버에 저장된 mainJson을 object형태로 넣어준다.(layouts.json포맷과 일치해야함)
this.$refs.setLayerBlockData({...})
```
#### 노티 알림 표시
```js
this.$refs.fastComposer.notification.success('success message');
```
#### 노티 알림 가리기
```js
this.$refs.fastComposer.notification.error('error message');
```

#### 레이아웃 템플릿

##### 레이아웃에서의 요소 추가/삭제

```json
{
  "params": [
    {
      "name": "...",
      "type": "list",
      "maxLength": 3,
      "params": [
        {
          "name": "...",
          "type": "...",
          "description": "...",
          "isRequired": true
        }
      ]
    }
  ],
}
```

##### example

###### layout.json

```json
{
  "params": [
    {
      "name": "cards",
      "type": "list", 
      "description": "추가/삭제를 이용하여 원하는 만큼 카드 리스트를 구현 할 수 있습니다.",
      "maxLength": 3,
      "params": [
        {
          "name": "src",
          "type": "image",
          "description": "image url"
          "isRequired": true
        },
        {
          "name": "width",
          "type": "number",
          "description": "image width(pixel)"
        },
        {
          "name": "height",
          "type": "number",
          "description": "image height(pixel)"
        },
        {
          "name": "alt",
          "type": "text",
          "description": "alternative text"
        }
      ]
    },
    {
      "name": "tabs",
      "type": "list",
      "description": "추가/삭제를 이용하여 원하는 만큼 탭 리스트를 구현 할 수 있습니다.",
      "maxLength": 5,
      "params": [
        {
          "name": "content",
          "type": "textarea",
          "description": "text area"
        },
        {
          "name": "width",
          "type": "number",
          "description": "image width(pixel)"
        },
        {
          "name": "height",
          "type": "number",
          "description": "image height(pixel)"
        },
        {
          "name": "alt",
          "type": "text",
          "description": "alternative text"
        }
      ]
    }
  ],
  "values": {
    "title": "제목",
    "cards": [
      {
        "src": "https://via.placeholder.com/320x320.png/00c",
        "width": "320",
        "height": "320",
        "alt": "simple image"
      }
    ],
    "tabs": []
  }
}
```

###### layout.ejs

```ejs
  <% cards.forEach((item) => { %>
    <div><img src="<%= item.src %>"/></div>
    <div><%= item.width%></div>
    <div><%= item.height %></div>
    <div><%= item.alt %></div>
  <% }); %>
```

---

may the **SOURCE** be with you...
