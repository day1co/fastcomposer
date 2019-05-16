//
// entry-point for vue-cli-service build/serve
//
import Vue from 'vue';
import axios from 'axios';
import Composer from './views/composer.vue';

// sample layouts with es6 module:
import layouts from '../public/layouts';

// sample layouts with commonjs bundle
// need to build with `npm run build-layouts` or else
// import layouts from '../public/layouts/all.json';
// import '../public/layouts/all.css';

Vue.config.productionTip = false;

const el = document.querySelector('#app');
const value = el.dataset.value || el.value;

// sample layouts with commonjs bundle:
// FIXME: resolve icons automatically...
// layouts.forEach(layout => {
//   layout.icon = require(`../public/layouts/${layout.id}/icon.svg`);
// });

new Vue({
  el,
  render(createElement) {
    return createElement(Composer, {
      props: {
        value,
        layouts,
      },
      ref: 'composer',
      on: {
        save(html, json) {
          console.log('**save: html=', html, 'json=', json);
          alert('check console log');
        },
      },
    });
  },
  async created() {
    const res = await axios.get('/sample.json');
    this.$refs.composer.openJson(JSON.stringify(res.data));
    this.$root.$on('fc-upload', event => console.log('GLOBAL fc-upload', event));
  },
});
