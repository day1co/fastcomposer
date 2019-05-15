<template>
  <div class="fc-composer">
    <div class="side-area">
      <Layout :layouts="layoutArray" :width="`18rem`" @select="onSelectLayout"/>
      <layer :layers="layers" :width="`18rem`" @select="onSelectLayer" @save="save"/>
    </div>
    <div class="preview-area">
      <preview-pane :layers="layers" :selectedLayer="selectedLayer"/>
    </div>
    <div class="side-area" v-if="isActiveEditor">
      <editor :layer="selectedLayer"/>
    </div>
    <button class="save-btn" @click="save"><i class="fas fa-save"></i></button>
  </div>
</template>

<script>
  import { template, cloneDeep } from 'lodash';
  import marked from 'marked';

  import Layout from './layout.vue';
  import Layer from './layer.vue';
  import editor from './editor.vue';
  import PreviewPane from './preview.vue';

  export default {
    name: 'composer',
    components: {
      Layout,
      Layer,
      editor,
      PreviewPane,
    },
    props: {
      value: {
        type: String,
        default: '[]',
      },
      layouts: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    computed: {
      selectedLayer() {
        return this.layers[this.editorLayoutIndex];
      },
      isActiveEditor(){
        return this.editorLayoutIndex >= 0;
      },
      layerHtml() {
        const html = this.layers
          .map(
            layer => `
<section class="fc-block fc-layout fc-layout-${layer.layout.id}">
${layer.layout.templateFunc({ $markdown: marked, ...layer.values })}
</section>`,
          )
          .join('\n');

        return html;
      },
    },
    data() {
      return {
        layoutArray: [],
        layoutMap: {},
        layers: [],
        editorLayout: {},
        editorLayoutIndex: -1,
      };
    },
    methods: {
      nextLayerId() {
        const seq = (this._blockIdSeq = this._blockIdSeq ? ++this._blockIdSeq:1);
        const nonce = Math.random()
          .toString(36)
          .substr(2, 9);
        return `fc-block-${seq}-${nonce}`;
      },
      onSelectLayout(layout) {
        const layer = {
          id: this.nextLayerId(),
          layout: layout,
          values: cloneDeep(layout.values) || {}, // clone!! not ref!
        };
        this.addLayer(layer);
        this.onSelectLayer(layer);
      },
      addLayer(layer) {
        this.layers.push(layer);
      },
      onSelectLayer(selectLayer) {
        const selectLayerIndex = this.layers.indexOf(selectLayer);
        this.editorLayoutIndex = selectLayerIndex;
      },
      save() {
        const html = this.layerHtml;
        // replace layout object => layout id
        const layers = this.layers.map(layer => Object.assign({}, layer, { layout: layer.layout.id }));
        const json = JSON.stringify(layers, null, 2);
        // TODO: save html only!
        // AS-IS: save generated html with source json
        this.$emit('save', html, json);
      },
      openLayouts(layouts) {
        console.log('open layouts', layouts);
        return Promise.resolve(layouts)
          .then(layouts => {
            // precompile all layout templates
            this.layoutArray = layouts.map(layout => {
              return Object.assign(layout, { templateFunc: template(layout.template) });
            });
            // lookup table for layout id => layout object
            this.layoutMap = this.layoutArray.reduce((layoutMap, layout) => {
              layoutMap[layout.id] = layout;
              return layoutMap;
            }, {});
          })
          .catch(err => {
            console.error('bad or missing layouts', err);
            this.layoutArray = [];
            this.layoutMap = {};
          });
      },
      openJson(json) {
        console.log('open json', json);
        return Promise.resolve(json)
          .then(json => {
            // TODO: parse html!
            // AS-IS: parse source json string
            // replace layout id => layout object, give id if absent
            this.layers = JSON.parse(json).map(layer => {
              return Object.assign({ id: this.nextLayerId() }, layer, { layout: this.layoutMap[layer.layout] });
            });
            console.log('open', this.layers);
          })
          .catch(err => {
            console.error('bad or missing value', err);
            this.layers = [];
          });
      },
    },
    async created() {
      return Promise.all([this.openLayouts(this.layouts), this.openJson(this.value)]);
    },
  };
</script>

<style lang="scss" scoped>
  .fc-composer {
    display: flex;
    overflow: hidden;
    height: 100vh;
    margin: 1rem;
  }

  .side-area {
    width: 20rem;
  }

  .preview-area {
    width: 100%;
    height: 100%;
  }

  .save-btn {
    position: fixed;
    cursor: pointer;
    border-radius: 50%;
    right: 15px;
    bottom: 35px;
    width: 5rem;
    height: 5rem;
    background-color: #6e827f;
    color: white;
  }

</style>
