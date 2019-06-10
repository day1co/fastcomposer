<template>
  <div class="fc-composer"
   :class="[
    viewport ? { ['fc-composer--' + viewport]: viewport } : 'fc-composer--landscape',
    isVisible && 'fc-composer--aside'
  ]"
  >
    <composer-header
      @toggleViewport="onToggleViewport"
    />
    <composer-content
      :layoutKits="layoutKits"
      :layers="layers"
    />

    <div class="fc-block__edit" v-if="getCurrentLayer" v-draggable style="position: absolute;top:50%;left: 50%;">
      <div class="draggablePopupTools">
        <button @click="closePopup()">
          <i class="material-icons">close</i>
        </button>
      </div>
      <editor :layer="getCurrentLayer" />
    </div>
  </div>
</template>

<script>
  import { cloneDeep } from 'lodash';
  import { uniqueId } from './../utils/utils';
  import EventBus from './../event-bus/event-bus';
  import marked from 'marked';
  import ComposerHeader from '../components/header.vue';
  import ComposerContent from '../components/content/content.vue';
  import Editor from '../components/editor';
  import { Draggable } from 'draggable-vue-directive';

  export default {
    name: 'composer',
    directives: {
      Draggable
    },
    components: {
      ComposerHeader,
      ComposerContent,
      Editor,
    },
    mounted() {
      const getSelectedIndex = layer => this.layers.indexOf(layer);

      // function0
      EventBus.$on('selectedLayer', (layer) => {
        this.currentLayerIndex = getSelectedIndex(layer);
        this.currentLayer = this.layers[this.currentLayerIndex];
        // console.log(this.getCurrentLayer());
      });

      // function1
      EventBus.$on('addLayer', (layoutKit) => {
        const layer = {
          id: uniqueId(),
          layout: layoutKit,
          values: cloneDeep(layoutKit.values) || {},
        };

        this.layers.push(layer);
        this.currentLayerIndex = getSelectedIndex(layer);
      });

      // function 2
      EventBus.$on('toggleAsideMenu', () => {
        this.isVisible = !this.isVisible;
      });

      EventBus.$on('save', (html) => {
        console.log(html);
      });
    },
    computed: {
      getCurrentLayer() {
        return this.layers[this.currentLayerIndex];
      },
      layerHtml() {
        const html = this.layers
          .map(layer => `
<section class="fc-block fc-layout fc-layout-${layer.layout.id}">
${layer.layout.templateFunc({$markdown: marked, ...layer.values})}
</section>`,
          )
          .join('\n');

        return html;
      },
    },
    data() {
      return {
        layoutKits: [],
        layers: [],
        currentLayerIndex: -1,
        viewport: '',
        isVisible: true, // 작업 편의를 위해 임시로
      };
    },
    methods: {
      onToggleViewport(viewport) {
        this.viewport = viewport;
      },
      closePopup() {
        this.currentLayerIndex = -1;
      },
      removeLayer(layer, layerIndex) {
        if (layerIndex !== -1) {
          this.layers.splice(layerIndex, 1);
        }
      },
      setLayoutKits(layoutKits) {
        this.layoutKits = layoutKits;
      },
      setLayerBlockData(layerBlockData) {
        /**
         * layoutMap은 LayerBlackData에서 사용하니 사용구간으로 이동
         */
        this.layoutMap = this.layoutKits.reduce((layoutMap, layout) => {
          layoutMap[layout.id] = layout;
          return layoutMap;
        }, {});

        /**
         * uniqueId -> 밖으로 빼서처리해도 될거같은데...
         * @type {any}
         */
        this.layers = Object.assign([], layerBlockData.map(layer => Object.assign({id: uniqueId()}, layer, {layout: this.layoutMap[layer.layout]})));
      },
      save() {
        const layerHtml = this.layerHtml;
        // replace layout object => layout id
        const layers = this.layers.map(layer => Object.assign({}, layer, {layout: layer.layout.id}));
        const layerJson = JSON.stringify(layers, null, 2);
        // TODO: save html only!
        // AS-IS: save generated html with source json
        this.$emit('save', layerHtml, layerJson);
      },
    },
  };
</script>

<style lang="scss">
  @import './../assets/scss/style.scss';

  .fc-composer {
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    display: flex;
    margin-left: auto;
    margin-right: auto;
    padding-top: $header-size;
    padding-bottom: 2rem;
    max-width: percentage(1);
    width: percentage(1);
    height: 100vh;
    font-size: $font-size;
    @include transition(null, 0.3s);

    &--flush {
      padding: 0;

      .fc-composer__content {
        margin-left: 0;
        margin-right: 0;
      }
    }

    &--landscape {
      padding-right: 0;
    }

    &--aside {
      padding-right: $sidebar-size;
    }

    &--portrait {
      width: percentage(1);
      max-width: $w-mobile;
      padding-right: 0;
    }

    &__header {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 101;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 1.8rem;
      padding-right: 1.8rem;
      width: percentage(1);
      height: $header-size;
      &__h {
        font-size: 1.8rem;
        color: $white;
      }

      &__utils {
        display: flex;

        .fc-utils__btn {
          flex: 1;
          display: flex;
          margin-left: 0.8rem;
          color: $white;
          align-items: center;
        }
      }
    }

    .editor-draggable-area {
      position: absolute;
      left: calc(50% - 95px);
      top: calc(50% - 57px);
      border: 1px solid #bbb;
      background-color: #ffffff;
    }

    .fc-block__edit {
      border: 0.8rem solid ;
      padding: 1.2rem 1.2rem;
      background-color: #f8f8f8;
      .draggablePopupTools {
        text-align: right;
      }
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
