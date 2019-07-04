//
// entry-point for vue-cli-service build/serve
//
import Vue from 'vue';
import Composer from './views/composer.vue';

import layouts from '../layouts';
import sample from '../layouts/sample.json';

new Vue({
  render(createElement) {
    return createElement(Composer, {
      props: {
        layerModals: sample,
        layoutModels: layouts,
      },
      on: {
        save(html, json) {
          console.log('**save: html=', html, 'json=', json);
          alert('check console log');
        },
      },
    });
  },
}).$mount('#app');
