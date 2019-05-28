<template>
  <div class="fc-composer">
    <div class="side-area" v-if="isLayerKit">
      <Layout :layouts="layoutArray" :width="`18rem`"
              @select="onSelectLayout"/>
    </div>
    <div class="preview-area">
      <preview
        :layers="layers"
        :selectedLayer="selectedLayer"
        @select="onSelectLayer"
        @toggleLayerKit="onToggleLayerKit"
      />
    </div>
    <div class="editor-draggable-area" v-if="isActiveEditor" v-draggable>
      <div style="position:relative;">
        <div class="btn-group" style="position: absolute; right: 0;">
          <button type="button" class="btn" @click="unSelectedLayer"><i class="far fa-window-close"></i></button>
        </div>
      </div>
      <editor :layer="selectedLayer"/>
    </div>
    <button class="save-btn" @click="save"><i class="fas fa-save"></i></button>
  </div>
</template>

<script>
  import { template, cloneDeep } from 'lodash';
  import marked from 'marked';

  import Layout from '../components/layout.vue';
  import Editor from '../components/editor.vue';
  import Preview from '../components/preview.vue';
  import { Draggable } from 'draggable-vue-directive';

  export default {
    name: 'composer',
    directives: {
      Draggable,
    },
    components: {
      Layout,
      Editor,
      Preview,
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
        isLayerKit: true,
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
     // 레이터 data 컨트롤 영역
      onSelectLayer(selectLayer) {
        const selectLayerIndex = this.layers.indexOf(selectLayer);
        this.editorLayoutIndex = selectLayerIndex;
      },
      addLayer(layer) {
        this.layers.push(layer);
      },
      removeLayer(layer, layerIndex) {
        if (layerIndex!== -1) {
          this.layers.splice(layerIndex, 1);
          this.onSelectLayer(layer);
        }
      },
      upLayer(layer, layerIndex) {
        if (layerIndex > 0) {
          const tempLayer = this.layers[layerIndex];
          this.$set(this.layers, layerIndex, this.layers[layerIndex - 1]);
          this.$set(this.layers, layerIndex - 1, tempLayer);
        }
      },
      downLayer(layer, layerIndex) {
        if (layerIndex!== -1 && layerIndex < this.layers.length - 1) {
          const tempLayer = this.layers[layerIndex];
          this.$set(this.layers, layerIndex, this.layers[layerIndex + 1]);
          this.$set(this.layers, layerIndex + 1, tempLayer);
        }
      },
      toggleLayer(layerIndex, isShow) {
        this.$set(this.layers[layerIndex], 'hidden', isShow);
      },
      // 레이아웃 컨트롤 영역
      onSelectLayout(layout) {
        const layer = {
          id: this.nextLayerId(),
          layout: layout,
          values: cloneDeep(layout.values) || {}, // clone!! not ref!
        };
        this.addLayer(layer);
        this.onSelectLayer(layer);
      },
      openLayouts(layouts) {
        console.log('open layouts', layouts);
        return Promise.resolve(layouts)
          .then(layouts => {
            // precompile all layout templates
            this.layoutArray = layouts.map(layout => Object.assign(layout, { templateFunc: template(layout.template)}));
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
      onToggleLayerKit() {
        this.isLayerKit = !this.isLayerKit;
      },
      unSelectedLayer() {
        this.editorLayoutIndex = -1;
      },
      save() {
        const layerHtml = this.layerHtml;
        // replace layout object => layout id
        const layers = this.layers.map(layer => Object.assign({}, layer, { layout: layer.layout.id }));
        const layerJson = JSON.stringify(layers, null, 2);
        // TODO: save html only!
        // AS-IS: save generated html with source json
        this.$emit('save', layerHtml, layerJson);
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
    position: relative;
    overflow: hidden;
    height: 100vh;
    margin: 1rem;

    .editor-draggable-area {
      position: absolute;
      left: calc(50% - 95px);
      top: calc(50% - 57px);
      border: 1px solid #bbb;
      background-color: #ffffff;
    }
  }

  .side-area {
    width: 20rem;
  }

  .preview-area {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
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
