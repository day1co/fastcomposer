<template>
  <div class="fc-composer"
   :class="[
    viewport ? { ['fc-composer--' + viewport]: viewport } : 'fc-composer--landscape',
    isVisible && 'fc-composer--aside'
  ]"
  >
    <composer-header/>
    <div class="fc-composer__content">
      <preview
        :layers="layers"
      />
      <composer-aside
        :layers="layers"
        :layouts="layouts"
      />
    </div>

    <div class="fc-block__edit" v-if="currentLayer" v-draggable>
      <div class="draggablePopupTools">
        <button @click="closePopup()">
          <i class="material-icons">close</i>
        </button>
      </div>
      <editor :layer="currentLayer" />
    </div>

    <modal v-if="notification.state" @close="notification.hide()">
      <h3 slot="header">알림</h3>
      <p slot="body">저장되었습니다</p>
    </modal>
  </div>
</template>

<script>
  import { cloneDeep } from 'lodash';
  import { Draggable } from 'draggable-vue-directive';
  import { uniqueId, restructureLayouts } from './../utils/utils';
  import EventBus from './../event-bus/event-bus';
  import marked from 'marked';
  import ComposerHeader from '../components/header/header.vue';
  import Editor from '../components/editor/editor';
  import Preview from '../components/content/preview/preview';
  import ComposerAside from '../components/content/aside/aside';
  import Modal from '../components/common/modal';

  export default {
    directives: {
      Draggable
    },
    components: {
      Modal,
      ComposerHeader,
      Preview,
      ComposerAside,
      Editor,
    },
    props: {
      layoutModels: {
        type: Array,
        default () {
          return [{}];
        }
      },
      layerModals: {
        type: Array,
        default () {
          return [{}];
        }
      },
    },
    mounted() {
      this.setLayouts(this.layoutModels);
      this.setLayerBlockData(this.layerModals);
    },
    created() {
      // ㅠㅠ
      EventBus.$on('selected-layer', this.onUpdateCurrentLayerIndex);
      EventBus.$on('add-layer', this.onAddLayer);
      EventBus.$on('remove-layer', this.onRemoveLayer);
      EventBus.$on('toggle-aside', this.onToggleAside);
      EventBus.$on('save', this.onSave);
      EventBus.$on('toggle-viewport', this.onChangeViewport);
      EventBus.$on('move-selected-layer',this.onMoveSelectedLayer);
      EventBus.$on('fc-upload', this.onUploadFile);
    },
    computed: {
      currentLayer() {
        return this.layers[this.currentLayerIndex];
      },
      layerHtml() {
        return this.layers.map(layer => `
            <section class="fc-block fc-layout fc-layout-${layer.layout.id}">
              ${layer.layout.templateFunc({$markdown: marked, ...layer.values})}
            </section>`,
          ).join('\n');
      },
      layoutMaps() {
        return this.layouts.reduce((layoutMap, layout) => {
          layoutMap[layout.id] = layout;
          return layoutMap;
        }, {});
      },
      scrollPoint() {
        return this.$el.getElementsByClassName('fc-layer-preview-container')[this.currentLayerIndex].offsetTop;
      }
    },
    data() {
      return {
        layouts: [],
        layers: [],
        currentLayerIndex: -1,
        viewport: '',
        isVisible: true,
        notification: {
          state: false,
          show() {
            this.state = true;
          },
          hide() {
            this.state = false;
          }
        }
      };
    },
    methods: {
      onUpdateCurrentLayerIndex(index) {
        this.currentLayerIndex = index;
      },
      onAddLayer(layout) {
        this.layers.push({
          id: uniqueId(),
          layout,
          values: cloneDeep(layout.values) || {},
        });
        this.currentLayerIndex = this.layers.length - 1
      },
      onRemoveLayer(index) {
        if (index !== -1) {
          this.layers.splice(index, 1);
        }
      },
      onToggleAside() {
        this.isVisible = !this.isVisible;
      },
      onChangeViewport(viewport) {
        this.viewport = viewport;
      },
      onMoveSelectedLayer() {
        this.$el.getElementsByClassName('fc-composer__content')[0].scrollTop = this.scrollPoint;
      },
      onUploadFile(fileInfo, callback) {
        this.$emit('uploadFile', fileInfo, callback);
      },
      closePopup() {
        this.currentLayerIndex = -1;
      },
      setLayouts(layouts) {
        this.layouts = restructureLayouts(layouts);
      },
      setLayerBlockData(layerBlockData) {
        if (typeof layerBlockData === 'string') {
          layerBlockData = JSON.parse(layerBlockData);
        }

        this.layers = Object.assign([], layerBlockData.map(layer => Object.assign({id: uniqueId()}, layer, {layout: this.layoutMaps[layer.layout]})));
      },
      onSave() {
        const layerHtml = this.layerHtml;
        // replace layout object => layout id
        const layers = this.layers.map(layer => Object.assign({}, layer, {layout: layer.layout.id}));
        const layerJson = JSON.stringify(layers, null, 2);
        // TODO: save html only!
        // AS-IS: save generated html with source json
        this.$emit('save', layerHtml, layerJson);
      },
    },
    beforeDestroy() {
      EventBus.$off();
    }
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
      position: absolute;
      top:50%;
      left: 50%;
      max-height: 1000px;
      border: 0.8rem solid ;
      padding: 1.2rem 1.2rem;
      background-color: #f8f8f8;
      overflow: scroll;
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
