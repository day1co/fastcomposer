# FAST COMPOSER

a layout based WYSIWYG html editor.

## Table Contents

* [Project setup](#Project-setup)
* [설치](#설치)
* [사용하기](#사용하기-Vuejs)

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

## 설치

```console
$ npm install --save @fastcampus/fastcomposer
```

## 사용하기-Vuejs

### 로드하기

#### 템플릿

```html
Vue DOM 속성을 사용하는 경우 ref 속성 정의
<composer ref="fastComposer"/>
```

or

```html
<composer/>
```
#### 스크립트

```javascript
import Composer from '@fastcampus/fastcomposer/src/views/composer';
import '@fastcampus/layouts/src/all.css';

...

components: {
  Composer
}
```

### 속성

| Name | Type | Default | Optional | Description |
|---|---|---|---|---|
| layoutModels | Array | [] | No | @fastcampus/layouts list를 넣어준다 |
| layerModals | Array | [] | Yes |서버로부터 저장된 layer data 가 존재한다면 이곳에 넣어준다. |

### 메서드

#### 노티 알림 표시

```javascript
this.$refs.fastComposer.notification.show();
```

#### 노티 알림 삭제

```javascript
this.$refs.fastComposer.notification.hide();
```

### 이벤트
#### save

template 을 편집하고 저장에 대해 callback 을 받는다

```html
  <composer
    @save="save"
  />
```

```javascript
...
methods: {
  save (html, json) {
    // ...
  }
}
...
```

| Name | Type | Description |
|---|---|---|
| html | String | layout 과 사용자가 입력한 템플릿 결과 값이다 |
| json | String | 사용자가 입력한 템플릿의 데이터를 String 형 json 값 이다 |


#### uploadFile

템플릿에서 파일 업로드 속성이 존재한다면 이 uploadFile 가 동작한다

```html
<composer
  @uploadFile="onUpload"
/>
```

```javascript
methods: {
  async onUpload(fileInfo, callback) {
    // 이곳에서 파일 업로드 작업 수행 후
    const res = await uploadToServer(fileInfo);
    
    // callback 으로 결과를 넘겨준다(res.url 되어야한다)
    callback(res);
  },
},
```

or

```javascript
methods: {
  onUpload(fileInfo, callback) {
    // 이곳에서 파일 업로드 작업 수행 후
    uploadToServer(fileInfo).then((res) => {
      // callback 으로 결과를 넘겨준다(res.url 되어야한다)
      callback(res);
    });
  },
},
```

| Name | Type | Description |
|---|---|---|
| fileInfo | Object | 파일서버로 업로드를 하기위한 파일 정보가 담겨있다 |
| callback | Function | 서버로부터 받은 결과 값을 callback 을 통하여 넘긴다<br> 결과값은 url 정보가 담겨있어야한다.<br> ex: res.url|


---

may the **SOURCE** be with you...
