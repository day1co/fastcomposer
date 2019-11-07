<template>
  <div>
    <div class="fc-composer"
     :class="[
      isLeftVisible && 'fc-composer--aside-l',
      isRightVisible && 'fc-composer--aside-r',
    ]"
    >
      <composer-header :notificationMessage="notification.message" :notificationType="notification.type"/>
      <div class="fc-composer__content">
        <composer-aside :className="'left'">
          <editor v-if="currentLayer" :layer="currentLayer" />
        </composer-aside>
        <preview
          :layers="layers"
        />
        <composer-aside :className="'right'">
          <layers
            :layers="layers"
            :currentLayerIndex="currentLayerIndex"
          />
        </composer-aside>
      </div>

      <layouts
        :layouts="layouts"
        :layoutStyle="layoutStyle"
        ref="layouts"
      />
    </div>
    <modal v-if="showModal">
      <div slot="main" class="fc-guide">
        <button @click="onHideModal">
          <i class="material-icons">close</i>
        </button>
        <table>
          <thead>
            <tr>
              <td>태그명</td>
              <td>표시</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>i</td>
              <td><i>FastComposer</i></td>
            </tr>
            <tr>
              <td>b</td>
              <td><b>FastComposer</b></td>
            </tr>
            <tr>
              <td>s</td>
              <td><s>FastComposer</s></td>
            </tr>
            <tr>
              <td>u</td>
              <td><u>FastComposer</u></td>
            </tr>
            <tr>
              <td>em</td>
              <td><em>FastComposer</em></td>
            </tr>
          </tbody>
        </table>
      </div>
    </modal>
  </div>
</template>

<script>
  import { cloneDeep } from 'lodash';
  import { uniqueId, restructureLayouts } from './../utils/utils';
  import EventBus from './../event-bus/event-bus';
  import marked from 'marked';
  import ComposerHeader from './../components/header/header.vue';
  import Editor from './../components/editor/editor';
  import Preview from './../components/content/preview/preview';
  import ComposerAside from './../components/content/aside/aside';
  import Layouts from './../components/content/layouts/layouts';
  import Layers from './../components/content/aside/layers/layers';
  import Modal from './../components/common/modal';

  export default {
    components: {
      ComposerHeader,
      Preview,
      ComposerAside,
      Editor,
      Layouts,
      Layers,
      Modal
    },
    props: {
      layoutModels: {
        type: Array,
        default () {
          return [];
        }
      },
      layerModals: {
        type: Array,
        default () {
          return [];
        }
      },
    },
    mounted() {
      this.setLayouts(this.layoutModels);

      if (this.layerModals.length) {
        this.setLayerBlockData(this.layerModals);
      }
    },
    created() {
      EventBus.$on('selected-layer', this.onUpdateCurrentLayerIndex);
      EventBus.$on('add-layer', this.onAddLayer);
      EventBus.$on('remove-layer', this.onRemoveLayer);
      EventBus.$on('toggle-aside', this.onToggleAside);
      EventBus.$on('save', this.onSave);
      EventBus.$on('move-selected-layer',this.onMoveSelectedLayer);
      EventBus.$on('fc-upload', this.onUploadFile);
      EventBus.$on('show-layout-panel', this.onShowLayouts);
      EventBus.$on('clear', this.clearMessageToast);
      EventBus.$on('showInfoTags', this.onShowModal);
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
        return this.$el.getElementsByClassName('fc-layer')[this.currentLayerIndex].offsetTop;
      }
    },
    data() {
      return {
        showModal: false,
        layouts: [],
        layers: [],
        layoutStyle: {},
        currentLayerIndex: -1,
        isLeftVisible: true,
        isRightVisible: true,
        notification: {
          message: '',
          type: '',
          success(message) {
            this.message = message;
            this.type = 'success';
          },
          error(message) {
            this.message = message;
            this.type = 'error';
          },
          default(message) {
            this.message = message;
            this.type = 'default';
          }
        }
      };
    },
    methods: {
      onShowModal() {
        this.showModal = true;
      },
      onHideModal() {
        this.showModal = false;
      },
      clearMessageToast() {
        this.notification.message = '';
      },
      onUpdateCurrentLayerIndex(index) {
        this.currentLayerIndex = index;
      },
      onAddLayer(layout) {
        if (this.currentLayerIndex < 0) {
          this.currentLayerIndex = this.layers.length - 1
        }

        this.layers.splice(this.currentLayerIndex + 1, 0, {
          id: uniqueId(),
          layout,
          values: cloneDeep(layout.values) || {},
        });

        this.currentLayerIndex = this.currentLayerIndex + 1;
      },
      onRemoveLayer(index) {
        if (index !== -1) {
          this.layers.splice(index, 1);
          this.currentLayerIndex = -1;
        }
      },
      onToggleAside(state) {
        if (state === 'left') {
          this.isLeftVisible = !this.isLeftVisible;
        } else {
          this.isRightVisible = !this.isRightVisible;
        }
      },
      onMoveSelectedLayer() {
        this.$el.getElementsByClassName('fc-composer__content')[0].scrollTop = this.scrollPoint;
      },
      onUploadFile(fileInfo, callback) {
        this.$emit('uploadFile', fileInfo, callback);
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
      onShowLayouts(event) {
        const layoutsWidth = 200;
        const { offsetLeft, offsetWidth } = event.currentTarget;

        this.layoutStyle = {
          left: `${offsetLeft - ((layoutsWidth / 2) - (offsetWidth / 2))}px`,
          width: `${layoutsWidth}px`
        };

        this.$refs.layouts.toggle();
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

    &--aside-l {
      padding-left: $sidebar-size + 4rem;
    }

    &--aside-r {
      padding-right: $sidebar-size;
    }

    &--portrait {
      width: percentage(1);
      max-width: $w-mobile;
      padding-right: 0;
    }

    &__content {
      overflow: scroll;
      position: relative;
      flex: 1;
      margin-left: 1.8rem;
      margin-right: 1.8rem;
      background: -moz-linear-gradient(top,  rgba(135,224,253,1) 0%, rgba(83,203,241,1) 40%, rgba(5,171,224,1) 100%);
      background: -webkit-linear-gradient(top,  rgba(135,224,253,1) 0%,rgba(83,203,241,1) 40%,rgba(5,171,224,1) 100%);
      background: linear-gradient(to bottom,  rgba(135,224,253,1) 0%,rgba(83,203,241,1) 40%,rgba(5,171,224,1) 100%);
      box-shadow: 0 .3rem 1rem rgba($black, 0.24), 0 .3rem 1rem rgba($black,
        0.16);
      @include transition(null, 0.3s);
    }
  }
  .fc-guide {
    em {
      font-style: normal;
      text-decoration: none;
      color: #424242;
      background-color: transparent;
      box-shadow: inset 0 -.8rem 0 #50e3c2;
    }
    table {
      border: .2rem solid #808080;
      td {
        border: .1rem solid #808080;
      }
      thead {
        td {
          text-align: center;
        }
      }
    }
  }
</style>
