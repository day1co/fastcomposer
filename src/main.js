//
// entry-point for vue-cli-service build/serve
//
import { restructureLayoutKit } from './utils/utils';
import Vue from 'vue';
import axios from 'axios';
import Composer from './views/composer.vue';

// sample layouts with es6 module:
import layoutKits from '../public/layouts';
// import '@fastcampus/layouts/src/all.css';

// sample layouts with commonjs bundle
// need to build with `npm run build-layouts` or else
// import layouts from '../public/layouts/all.json';
// import '../public/layouts/all.css';

Vue.config.productionTip = false;

const el = document.querySelector('#app');

// sample layouts with commonjs bundle:
// FIXME: resolve icons automatically...
// layouts.forEach(layout => {
//   layout.icon = require(`../public/layouts/${layout.id}/icon.svg`);
// });

const app = new Vue({
  el,
  render(createElement) {
    return createElement(Composer, {
      ref: 'composer',
      on: {
        save(html, json) {
          console.log('**save: html=', html, 'json=', json);
          alert('check console log');
        },
      },
    });
  },
  mounted() {
    this.$refs.composer.setLayoutKits(restructureLayoutKit(layoutKits));
  },
});
/**
 * vue 라이프사이클에서 layout과 data를 구성하기보단 밖에서 별도로 분리하여 설정
 */
axios.get('/sample.json').then((resources) => {
  console.log(resources);
  app.$refs.composer.setLayerBlockData(resources.data);
});

// console.log(layoutKits); // 실제 layout 도구들...
// console.log(res.data); // layoutKits들을 이용하여 data와 결합하여 preview에 보여준다

