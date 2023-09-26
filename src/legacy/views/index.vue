<template>
  <div
    tabindex="0"
  >
    <div class="fc-composer"
     :class="[
      'fc-composer--aside-l',
      'fc-composer--aside-r',
      !favoriteLayoutIds.length && 'fc-composer--no-favorites',
      'fc-composer__' + options.colorMode,
      'fc-composer__hide-layer-' + options.hideLayerMode,
      options.simpleFavorites && 'fc-composer__simple-favorites',
      options.simpleLayers && 'fc-composer__simple-layers'
    ]"
    >
      <div class="fc-tooltip">
        <div class="fc-tooltip__content"></div>
      </div>
      <!--알림-->
      <toast
        @clear="onClearToast"
        :message="notification.message"
        :type="notification.type"/>
      <!--헤더-->
      <!--
        @validate="onValidateLayer"
      -->
      <composer-header
        @show-layout-panel="onShowLayouts"
        @show-info-tags="onShowModal"
        @add="onAddLayer"
        @toggle-device-mode="onToggleDeviceMode"
        :favoriteLayoutIds="favoriteLayoutIds"
        :layouts="layoutModels"
        :layerCount="layers.length"
        :warnCount="layers.filter(layer => layer.hasSyntaxErrorTags).length"
        :notificationMessage="notification.message"
        :notificationType="notification.type">

        <!-- <button class="btn" @click="onToggleDeviceMode">
          <span class="material-icons">devices</span>
        </button> -->
        <button class="btn" @click="onShowModal">
          <span class="material-icons">help</span>
        </button>
        <button class="btn" @click="showConfigWindow = true">
          <span class="material-icons">settings</span>
        </button>
        <!-- <button class="btn" @click="onValidateLayer">
          <span class="material-icons">check</span>
          <label>검증</label>
        </button> -->
        <button class="btn" @click="onSave">
          <span class="material-icons">save</span>
          <label>저장</label>
        </button>
      </composer-header>

      <splitpanes @resize="onHorizontalResize">

        <pane class="scrollable" min-size="20" :size="options.horizontalSizes?.[0]">
          <editor
            v-show="currentLayer"
            :layer="currentLayer"
            :state="state"
            ref="editor" />
        </pane>

        <pane class="scrollable" min-size="20" :size="options.horizontalSizes?.[1]">
          <preview
            :blocks="layers"
            :selected.sync="selected"
            ref="preview" />
        </pane>

        <pane min-size="20" :size="options.horizontalSizes?.[2]">

          <splitpanes horizontal @resize="onVerticalResize">

            <pane :size="options.verticalSizes?.[0]">
              <!--
                @up="onUpBlock"
                @down="onDownBlock"
              -->
              <layers
                :page="page"
                :state="state"
                :selected.sync="selected"
                @toggle-layouts="layoutOpened = !layoutOpened"
                ref="layers" />
            </pane>

            <pane
              :size="options.verticalSizes?.[1]"
              style="min-height: 3.2rem">
              <history :state="state" />
            </pane>

          </splitpanes>

        </pane>

      </splitpanes>

      <layouts
        v-show="layoutOpened"
        @add-layer="onAddLayer"
        @add-favorite-layout="onAddFavoriteLayout"
        :favoriteLayoutIds="favoriteLayoutIds"
        :layouts="layouts"
        ref="layouts" />

      <Dialog :visible.sync="showModal">
        <guide />
      </Dialog>

      <Dialog :visible.sync="showConfigWindow">
        <div slot="header">
          <h3> FastComposer 설정 </h3>
        </div>
        <div slot="main">
          <p class="fc-option-row">
            <label for="fc-options-colormode">
              테마:
            </label>
            <select v-model="options.colorMode" id="fc-options-colormode">
              <option value=""> 자동 </option>
              <option value="light"> 밝게 </option>
              <option value="dark"> 어둡게 </option>
            </select>
          </p>
          <p class="fc-option-row">
            <label for="fc-options-hidelayermode">
              미리보기 영역에서 <i class="material-icons">visibility_off</i> 레이어를:
            </label>
            <select v-model="options.hideLayerMode" id="fc-options-hidelayermode">
              <option value=""> 흐리게 보이기 </option>
              <option value="hatched"> 흐리게 + 빗금 </option>
              <option value="gutter-only"> 레이어 정보만 보이기 </option>
              <option value="hide"> 완전히 숨기기 </option>
            </select>
          </p>
          <p class="fc-option-row">
            <label for="fc-options-simplefavorites">
              레이아웃 즐겨찾기 얇게 표시:
            </label>
            <input
              type="checkbox"
              v-model="options.simpleFavorites"
              id="fc-options-simplefavorites" />
          </p>
          <p class="fc-option-row">
            <label for="fc-options-simplelayers">
              레이어 한 줄로 표시:
            </label>
            <input
              type="checkbox"
              v-model="options.simpleLayers"
              id="fc-options-simplelayers" />
          </p>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script>
  import { Splitpanes, Pane } from 'splitpanes';
  import { cloneDeep } from 'lodash';
  import { uniqueId, restructureLayouts } from '../utils';
  import EventBus from '../event-bus.vue';
  import { parse as marked } from 'marked';
  import Toast from '../components/toast.vue';
  import Dialog from '../components/dialog.vue';
  import ComposerHeader from './header.vue';
  import Editor from './editor/index.vue';
  import Preview from './preview.vue';
  import Layouts from './layouts.vue';
  import Layers from './layers.vue';
  import History from './history/index.vue';
  import Guide from './guide.vue'

  import Page from '../../page';
  import State from '../../state';

  export default {
    components: {
      Splitpanes,
      Pane,
      Toast,
      ComposerHeader,
      Preview,
      Editor,
      Layouts,
      Layers,
      History,
      Dialog,
      Guide,
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
    data() {
      const page = new Page({})
      return {
        page,
        state: new State(),
        selected: 0,
        favoriteLayoutIds: [],
        showModal: false,
        layoutOpened: false,
        options: {
          colorMode: '',
          hideLayerMode: '',
          horizontalSizes: [20, 60, 20],
          verticalSizes: [80, 20]
        },
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
        },
        isDevicePreviewMode: false,
        deviceType: 'desktop',
        showConfigWindow: false,
      };
    },
    methods: {
      onAddFavoriteLayout(layoutId) {
        if (this.favoriteLayoutIds.includes(layoutId)) {
          this.favoriteLayoutIds.splice(this.favoriteLayoutIds.indexOf(layoutId), 1);
        } else {
          this.favoriteLayoutIds.push(layoutId);
        }
      },
      onSelectToggleAll() {
        const to = !(this.checkedCount === this.layers.length)
        this.layers.forEach(layer => this.$set(layer, 'isChecked', to))
      },
      // onValidateLayer() {
      //   this.layers.forEach((layer) => {
      //     const layerValues = layer.values;
      //     const selfClosingTags = ['img', 'br', 'hr'];

      //     this.$set(layer, 'hasSyntaxErrorTags', false);
      //     for (const prop in layerValues) {
      //       let tags = typeof layerValues[prop] === 'string' ? layerValues[prop].match(/(<([^>]+)>)/igm) : '';

      //       if (tags) {
      //         tags = tags.map((tag) => tag.replace(/ .*?=('*.*'?|"*.*"?)/gim,'>'));

      //         this.$set(layer, 'hasSyntaxErrorTags', !tags.every((tag, index, array) => {
      //           const tagName = tag.match(/[A-Z0-9]/gim).join('');
      //           const openingLen = array.filter((item) => `<${ tagName }>` === item).length;
      //           const closingLen = array.filter((item) => `</${ tagName }>` === item).length;
      //           const hasSelfClosingTagLen = selfClosingTags.filter((item) => item === tagName).length;

      //           return openingLen === closingLen || hasSelfClosingTagLen;
      //         }));
      //       }
      //     }
      //   });
      // },
      moveFocusByAct(path) {
        if(path?.destination)
          this.selected = this.page.pathToIndex(path.destination)
      },
      onShowModal() {
        this.showModal = true;
      },
      onHideModal() {
        this.showModal = false;
      },
      onToggleLayerState(index) {
        this.state.act('layer.hide', this.layers[index].path)
      },
      onClearToast() {
        this.notification.message = '';
      },
      onUpdateCurrentLayerIndex(index) {
        this.selected = index;
      },
      onAddLayer(layout) {
        this.moveFocusByAct(this.state.act('layer.new', this.currentLayer?.path, layout))

        this.onUpdateCurrentLayerIndex(this.selected)
        this.focusEditor()
        this.layoutOpened = false
      },
      onRemoveLayer(index) {
        this.moveFocusByAct(this.state.act('layer.remove', this.layers[index].path))
      },
      onCloneLayer(index) {
        if (index !== -1) {
          this.layers.splice(index, 0, {
            id: uniqueId(),
            layout: this.layers[index].layout,
            values: JSON.parse(JSON.stringify(this.layers[index].values)) || {}
          });

          this.onUpdateCurrentLayerIndex(index + 1);
        }
      },
      onMoveSelectedLayer() {
        const $targetBlock = this.$refs.preview.$el.getElementsByClassName('fc-block')[this.selected];
        const $targetLayer = this.$refs.layers.$el.getElementsByClassName('fc-layer')[this.selected];

        $targetBlock && $targetBlock.scrollIntoView({ block: 'nearest' });
        $targetLayer && $targetLayer.scrollIntoView({ block: 'nearest' });
      },
      onUploadFile(fileInfo, callback) {
        // FIXME ???
        this.$emit('uploadFile', fileInfo, callback);
      },
      setLayouts(layouts) {
        this.layouts = layouts;
      },
      syncParamsAll(){
        this.layers.forEach( layer => {
          layer.values = this.getSyncedParams(layer);
        });
      },
      getSyncedParams(layer) {
        const {params, values} = layer.layout;
        let resultValues = cloneDeep( layer.values );
        if (params) {
          params.forEach( param => {
            const {name} = param;
            if( resultValues[name] === undefined) {
              resultValues[name] = values[name];
            }
          })
        }
        return resultValues;
      },
      onToggleLayerVisibility() {
        const selected = this.layers.filter(_ => _.isChecked)
        const isVisible = this.layers.filter(_ => _.isChecked).some(_ => _.hidden)
        this.layers.filter(_ => _.isChecked).forEach(_ => this.$set(_, 'hidden', !isVisible))
      },
      onShowLayouts() {
        this.$refs.layouts.toggle();
      },
      focusEditor() {
        this.$refs.editor.focus();
      },
      focusLayers() {
        this.$refs.layers.focus();
      },
      focusPreview() {
        this.$refs.preview.focus();
      },
      onSave() {
        const layerHtml = this.layerHtml;
        // old format: replace layout object => layout id
        //const layers = this.layers.map(layer => Object.assign({}, layer, {layout: layer.layout.id}));

        // new format: embed layout itself
        const layerJson = JSON.stringify(this.layers, null, 2);

        // TODO: save html only!
        // AS-IS: save generated html with source json
        this.$emit('save', layerHtml, layerJson);
      },
      onToggleDeviceMode() {
        this.isDevicePreviewMode = !this.isDevicePreviewMode;

        if (this.isDevicePreviewMode) {
          setTimeout(() => {
            this.loadLayers();
          }, 0);
        }
      },
      loadLayers() {
        const usedStyles = document.querySelectorAll("style[type='text/css']");
        const usedLinks = document.querySelectorAll("link[rel='stylesheet']");

        const doc = this.$el.getElementsByClassName('fc-frame')[0].contentWindow.document;

        [...usedStyles, ...usedLinks].forEach(el => doc.head.appendChild(el.cloneNode(true)));
        doc.head.innerHTML += '<style>body{background:#fff;color:#000}</style>'

        doc.body.innerHTML = this.layerHtml;
      },
      onChangeDevice(deviceType) {
        this.deviceType = deviceType;
      },
      onHorizontalResize(e) {
        this.options.horizontalSizes = e.map(_ => _.size)
      },
      onVerticalResize(e) {
        this.options.verticalSizes = e.map(_ => _.size)
      }
    },
    computed: {
      layers() {
        return this.page?.state
      },
      layouts() {
        return this.page?._layouts
      },
      checkedCount() {
        return this.layers.filter(layer => layer.isChecked).length;
      },
      warnCount() {
        return this.layers.filter(layer => layer.hasSyntaxErrorTags).length;
      },
      currentLayer() {
        return this.layers[this.selected];
      },
      layerHtml() {
        return this.layers.filter(layer => !layer.hidden).map(layer => `
            <section class="fc-block fc-layout fc-layout-${layer.layout.id}">
              ${layer.render()}
            </section>`,
          ).join('\n');
      },
      layoutMaps() {
        return this.layouts.reduce((layoutMap, layout) => {
          layoutMap[layout.id] = layout;
          return layoutMap;
        }, {});
      },
      // onToggleLayerVisibility
      isEverySelectedLayerVisible() {
        return !this.layers.filter(layer => layer.isChecked).some(layer => layer.hidden)
      }
    },
    created() {
      this.page = Page.fromDump(this.layerModals, this.layoutModels)
      this.state.registerModule('page', this.page)

      EventBus.$on('save', this.onSave);
      EventBus.$on('fc-upload', this.onUploadFile);
      try {
        this.favoriteLayoutIds = JSON.parse(localStorage['favoriteLayouts']);
      } catch(e) {
        this.favoriteLayoutIds = []
      }

      this.options = {
        ...this.options,
        colorMode: localStorage['fastcomposer-color-mode'] || '',
        ...(() => {
          try {
            return JSON.parse(localStorage['fastcomposer-options']) ?? {};
          } catch(e) {
            return {}
          }
        })()
      }
    },
    mounted() {
    },
    watch: {
      selected() {
        this.onMoveSelectedLayer();
      },
      favoriteLayoutIds: {
        handler(to) {
          try {
            localStorage['favoriteLayouts'] = JSON.stringify(to) ?? []
          } catch(e) {
            console.error(e);
          }
        },
        deep: true,
      },
      options: {
        handler(to) {
          try {
            localStorage['fastcomposer-options'] = JSON.stringify(to) ?? {}
          } catch(e) {
            console.error(e);
          }
        },
        deep: true,
      }
    },
    beforeDestroy() {
      EventBus.$off();
    }
  };
</script>

<style lang="scss">
  @import './../assets/scss/style.scss';

  .fc-dialog__container {
    main {
      width: 100%;
      height: 100vh;
    }
    .fc-frame-wrapper {
      &__selected {
        color: #FF0000;
      }
    }
  }
  .fc-dialog__content {
    height: 100%;
    .fc-frame-wrapper {
      text-align: center;
      height: 100%;
      margin: 0 auto;
      &__device-btns {
        display: flex;
        justify-content: center;
      }
      &--desktop {
        width: 100%;
      }
      &--tablet {
        width: 95.9rem;
      }
      &--phone {
        width: 59.9rem;
      }
      .fc-frame {
        width: 100%;
        height: calc(100vh - 10rem);
        border-width: 0;
      }
    }
  }
  .fc-tooltip {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 20000;
    &__content {
      position: absolute;
      top: 0;
      left: 3rem;
      padding: 0.5rem;
      min-width: 22rem;
      background-color: #eaeaea;
      z-index: 1;
      font-size: 1.5rem;
      border-radius: 0.3rem;
      &:before {
        position: absolute;
        top: 0.6rem;
        left: -0.7rem;
        width: 0;
        height: 0;
        content: '';
        border-top: 0.6rem solid transparent;
        border-bottom: 0.6rem solid transparent;
        border-right: 0.7rem solid #eaeaea;
      }
    }
  }

  .fc-composer {
    overflow-x: hidden;
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    margin-left: auto;
    margin-right: auto;
    width: percentage(1);
    height: 100vh;
    font-size: $font-size;
    font-family: $font-base !important;
    background: $background;
    color: $foreground;

    &--flush {
      padding: 0;
      .fc-composer__content {
        margin-left: 0;
        margin-right: 0;
      }
    }

    &--no-favorites {
      > .fc-layout {
        top: 0;
      }
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

  .fc-layout-broken {
    padding: 10px;
    background: repeating-linear-gradient(
        45deg,
        #c33,
        #c33 10px,
        #ffc 10px,
        #ffc 20px
    );

    pre {
      background: #f00;
    }
  }

  .fc-option-row {
    display: grid;
    grid-template-columns: auto 16rem;
    gap: 1rem;

    margin: 1rem 0;

    > label {
      text-align: right;
    }
    .material-icons {
      vertical-align: -0.25em;
    }
  }

</style>
