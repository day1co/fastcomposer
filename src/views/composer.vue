<template>
  <div
    tabindex="0"
    @keydown.exact.alt.shift.49.prevent="focusEditor"
    @keydown.exact.alt.shift.50.prevent="focusPreview"
    @keydown.exact.alt.shift.51.prevent="focusLayers"
    @keydown.exact.alt.shift.48.prevent="onShowLayouts"
  >
    <div class="fc-composer"
     :class="[
      isLeftVisible && 'fc-composer--aside-l',
      isRightVisible && 'fc-composer--aside-r',
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
      <composer-header
        @validate="onValidateLayer"
        @show-layout-panel="onShowLayouts"
        @show-info-tags="onShowModal"
        @add="onAddLayer"
        @toggle-device-mode="onToggleDeviceMode"
        :favoriteLayoutIds="favoriteLayoutIds"
        :layouts="layoutModels"
        :layerCount="layers.length"
        :warnCount="layers.filter(layer => layer.hasSyntaxErrorTags).length"
        :notificationMessage="notification.message"
        :notificationType="notification.type"/>
      <div class="fc-composer__content">
        <!--edit-->
        <div class="fc-aside fc-aside--left">
          <div class="fc-aside__content">
            <div class="fc-aside__container">
              <editor v-show="currentLayer" :layer="currentLayer" ref="editor" />
            </div>
          </div>
          <button
            type="button"
            class="fc-aside__btn fc-aside__btn--left"
            @click="onToggleAside('left')">
            <i class="material-icons">&#xE3E8;</i>
          </button>
        </div>

        <!--preview-->
        <preview
          :blocks="layers"
          :currentLayerIndex.sync="currentLayerIndex"
          ref="preview"
        />

        <!--layers-->
        <div class="fc-aside fc-aside--right">
          <div class="fc-aside__content">
            <button class="btn" @click="onUpBlock">
              <span class="material-icons">arrow_upward</span>
            </button>
            <button class="btn" @click="onDownBlock">
              <span class="material-icons">arrow_downward</span>
            </button>
            <span>선택된 레이어 수: {{checkedCount}}</span>
            <div class="fc-aside__container">
              <layers
                @up="onUpBlock"
                @down="onDownBlock"
                @hidden="onToggleLayerState"
                @selected-layer="onUpdateCurrentLayerIndex"
                @remove-layer="onRemoveLayer"
                @clone-layer="onCloneLayer"
                @add-favorite-layout="onAddFavoriteLayout"
                :favoriteLayoutIds="favoriteLayoutIds"
                :layers="layers"
                :currentLayerIndex.sync="currentLayerIndex"
                ref="layers"
              />
            </div>
          </div>
          <button
            type="button"
            class="fc-aside__btn fc-aside__btn--right"
            @click="onToggleAside('right')">
            <i class="material-icons">&#xE3E8;</i>
          </button>
        </div>
      </div>
      <layouts
        ref="layouts"
        @add-layer="onAddLayer"
        :layouts="layouts"
      />
    </div>
    <Dialog :visible.sync="showModal">
      <div slot="main" class="fc-guide">
        <table>
          <thead>
          <tr>
            <th>태그명</th>
            <th>표시</th>
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
        <table>
          <thead>
          <tr>
            <th>단축키</th>
            <th>기능</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Shift+Up/Down</td>
            <td>레이어 선택</td>
          </tr>
          <tr>
            <td>Alt+Shift+Up/Down</td>
            <td>선택 레이어 이동</td>
          </tr>
          <tr>
            <td>Alt+Shift+1</td>
            <td>레이어 속성</td>
          </tr>
          <tr>
            <td>Alt+Shift+2</td>
            <td>미리보기</td>
          </tr>
          <tr>
            <td>Alt+Shift+3</td>
            <td>레이어 목록</td>
          </tr>
          <tr>
            <td>Alt+Shift+0</td>
            <td>레이아웃 목록</td>
          </tr>
          <tr>
            <td>Up/Down/Home/End</td>
            <td>이전/다음/처음/마지막 항목</td>
          </tr>
          <tr>
            <td>Enter</td>
            <td>선택 &amp; 편집</td>
          </tr>
          </tbody>
        </table>
      </div>
    </Dialog>
    <Dialog :visible.sync="isDevicePreviewMode" :position="'top'" :dialogStyles="{ width: '100%', height: '100vh' }">
      <div slot="header" class="fc-frame-wrapper__device-btns">
        <button @click="onChangeDevice('desktop')" :class="{'fc-frame-wrapper__selected': deviceType === 'desktop'}">
          <span class="material-icons">desktop_mac</span>
        </button>
        <button @click="onChangeDevice('tablet')" :class="{'fc-frame-wrapper__selected': deviceType === 'tablet'}">
          <span class="material-icons">tablet_mac</span>
        </button>
        <button @click="onChangeDevice('phone')" :class="{'fc-frame-wrapper__selected': deviceType === 'phone'}">
          <span class="material-icons">phone_iphone</span>
        </button>
      </div>
      <div slot="main" class="fc-frame-wrapper" :class="`fc-frame-wrapper--${deviceType}`">
        <iframe class="fc-frame"></iframe>
      </div>
    </Dialog>
  </div>
</template>

<script>
  import { cloneDeep } from 'lodash';
  import { uniqueId, restructureLayouts } from '@/utils/utils';
  import EventBus from './../event-bus/event-bus';
  import marked from 'marked';
  import Toast from '@/components/toast/toast';
  import Dialog from '@/components/dialog/dialog';
  import ComposerHeader from './header/header.vue';
  import Editor from './editor/editor';
  import Preview from './preview/preview';
  import Layouts from './layouts/layouts';
  import Layers from './layers/layers';
  import LocalStorageService from '@/service/LocalStorage';

  export default {
    components: {
      Toast,
      ComposerHeader,
      Preview,
      Editor,
      Layouts,
      Layers,
      Dialog,
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

      this.$el.focus();
    },
    created() {
      EventBus.$on('save', this.onSave);
      EventBus.$on('fc-upload', this.onUploadFile);
      this.localStorageService = new LocalStorageService('favoriteLayouts');
      this.favoriteLayoutIds = this.localStorageService.get();
    },
    computed: {
      checkedCount() {
        return this.layers.filter(layer => layer.isChecked).length;
      },
      currentLayer() {
        return this.layers[this.currentLayerIndex];
      },
      layerHtml() {
        return this.layers.filter(layer => !layer.hidden).map(layer => `
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
    },
    data() {
      return {
        favoriteLayoutIds: [],
        localStorageService: null,
        showModal: false,
        layouts: [],
        layers: [],
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
        },
        isDevicePreviewMode: false,
        deviceType: 'desktop'
      };
    },
    methods: {
      onAddFavoriteLayout(layoutId) {
        if (this.favoriteLayoutIds.includes(layoutId)) {
          this.favoriteLayoutIds.splice(this.favoriteLayoutIds.indexOf(layoutId), 1);
        } else {
          this.favoriteLayoutIds.push(layoutId);
        }

        this.localStorageService.set(this.favoriteLayoutIds);
      },
      onUpBlock() {
        const checkedLayer = this.layers.filter(layer => layer.isChecked);
        const { uniqueId } = checkedLayer[0];
        const checkedFirstIndex = this.layers.findIndex(layer => layer.uniqueId === uniqueId);

        if (checkedFirstIndex) {
          const targetUniqueId = this.layers[checkedFirstIndex - 1].uniqueId;
          this.layers = [...this.layers.filter(layer => !layer.isChecked)];
          const targetIndex = this.layers.findIndex(layer => layer.uniqueId === targetUniqueId);
          this.layers.splice(targetIndex, 0, ...checkedLayer);
          this.onUpdateCurrentLayerIndex(targetIndex);
          this.onMoveSelectedLayer();
        }
      },
      onDownBlock() {
        const checkedLayer = this.layers.filter(layer => layer.isChecked);
        const { uniqueId } = checkedLayer[checkedLayer.length - 1];
        const checkedLastIndex = this.layers.findIndex(layer => layer.uniqueId === uniqueId);

        if (checkedLastIndex < this.layers.length - 1) {
          const targetUniqueId = this.layers[checkedLastIndex + 1].uniqueId;
          this.layers = [...this.layers.filter(layer => !layer.isChecked)];
          const targetIndex = this.layers.findIndex(layer => layer.uniqueId === targetUniqueId);
          this.layers.splice(targetIndex + 1, 0, ...checkedLayer);
          this.onUpdateCurrentLayerIndex(checkedLastIndex + 1);
          this.onMoveSelectedLayer();
        }
      },
      onValidateLayer() {
        this.layers.forEach((layer) => {
          const layerValues = layer.values;
          const selfClosingTags = ['img', 'br', 'hr'];

          this.$set(layer, 'hasSyntaxErrorTags', false);
          for (const prop in layerValues) {
            let tags = typeof layerValues[prop] === 'string' ? layerValues[prop].match(/(<([^>]+)>)/igm) : '';

            if (tags) {
              tags = tags.map((tag) => tag.replace(/ .*?=('*.*'?|"*.*"?)/gim,'>'));

              this.$set(layer, 'hasSyntaxErrorTags', !tags.every((tag, index, array) => {
                const tagName = tag.match(/[A-Z0-9]/gim).join('');
                const openingLen = array.filter((item) => `<${ tagName }>` === item).length;
                const closingLen = array.filter((item) => `</${ tagName }>` === item).length;
                const hasSelfClosingTagLen = selfClosingTags.filter((item) => item === tagName).length;

                return openingLen === closingLen || hasSelfClosingTagLen;
              }));
            }
          }
        });
      },
      onShowModal() {
        this.showModal = true;
      },
      onHideModal() {
        this.showModal = false;
      },
      onToggleLayerState(index, flag) {
        if (index !== -1) {
          this.$set(this.layers[index], 'hidden', flag);
        }
      },
      onClearToast() {
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
        this.onUpdateCurrentLayerIndex(this.currentLayerIndex);
        this.focusEditor();
      },
      onRemoveLayer(index) {
        if (index !== -1) {
          this.layers.splice(index, 1);
          if (index < this.layers.length) {
            this.onUpdateCurrentLayerIndex(null);
          }
        }
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
      onToggleAside(state) {
        if (state === 'left') {
          this.isLeftVisible = !this.isLeftVisible;
        } else {
          this.isRightVisible = !this.isRightVisible;
        }
      },
      onMoveSelectedLayer() {
        const $targetBlock = this.$refs.preview.$el.getElementsByClassName('fc-block')[this.currentLayerIndex];
        const $targetLayer = this.$refs.layers.$el.getElementsByClassName('fc-layer')[this.currentLayerIndex];

        $targetBlock && $targetBlock.scrollIntoView({ block: 'center' });
        $targetLayer && $targetLayer.scrollIntoView({ block: 'center' });
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

        // old format: replace layout id => layout object
        // this.layers = Object.assign([], layerBlockData.map(layer => Object.assign({id: uniqueId()}, layer, {layout: this.layoutMaps[layer.layout]})));

        this.layers = layerBlockData.map(layer => {
          if (typeof layer.layout === 'string') {
            // old format:
            // replace layout id => layout object
            layer.layout = this.layoutMaps[layer.layout];
          } else {
            // new format: layout object itself
            // TODO: layout version check!
            //if(layer.layout.version !== this.layoutMaps[layer.layout.id].version) {
            //}
            layer.layout = this.layoutMaps[layer.layout.id];
          }
          if (!layer.layout) {
            layer.layout = {
              id: 'broken',
              icon: '',
              description: '다른 레이아웃으로 새 레이어를 만들고 이 레이어는 삭제하세요',
              params: [],
              templateFunc: () => {
                return `<pre style="background:#fff;"><code>${JSON.stringify(layer.values)}</code></pre>`;
              },
              values: {},
            }
          }
          if (!layer.id) {
            layer.id = uniqueId();
          }

          if (!layer.uniqueId) {
            layer.uniqueId = uniqueId();
          }
          return {
            ...layer,
            isChecked: false
          };
        });
        // select first layer if available
        if (this.layers.length > 0) {
          this.onUpdateCurrentLayerIndex(0);
          this.syncParamsAll();
        }
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
      onShowLayouts() {
        this.$refs.layouts.toggle();
      },
      focusEditor() {
        this.isLeftVisible = true;
        this.$refs.editor.focus();
      },
      focusLayers() {
        this.isRightVisible = true;
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
        const doc = this.$el.getElementsByClassName('fc-frame')[0].contentWindow.document;

        usedStyles.forEach(usedStyle => doc.head.appendChild(usedStyle.cloneNode(true)));
        doc.body.innerHTML = this.layerHtml;
      },
      onChangeDevice(deviceType) {
        this.deviceType = deviceType;
      },
    },
    watch: {
      currentLayerIndex() {
        this.onMoveSelectedLayer();
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
    z-index: 10000;
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
    margin-left: auto;
    margin-right: auto;
    padding-top: $header-size;
    padding-bottom: 2rem;
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

    &--portrait {
      width: percentage(1);
      max-width: $w-mobile;
      padding-right: 0;
    }

    &--aside-l {
      .fc-composer__content__btn--left {
        left: $sidebar-size + 14rem;
      }
    }
    &--aside-r {
      .fc-composer__content__btn--right {
        right: $sidebar-size;
      }
    }

    &__content {
      display: flex;
      justify-content: space-between;
      position: relative;
      width: 100%;

      @include transition(null, 0.3s);

      .fc-preview {
        width: 100%;
        margin: 0 1.8rem;
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

  .fc-aside {
    display: flex;
    position: relative;
    z-index: 10;
    box-sizing: border-box;
    padding-bottom: 2rem;
    width: 0;
    max-width: $sidebar-size;
    color: $white;

    &__content {
      width: 100%;
      span {
        vertical-align: top;
      }
    }

    &__container {
      overflow: scroll;
      box-sizing: border-box;
      padding: 1.2rem 0.9rem 11rem;
      height: percentage(1);
      background-color: $secondary;
    }

    &__btn {
      position: absolute;
      top: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.8rem 0 1.8rem 0.6rem;
      background-color: $secondary;
      border-top-left-radius: 0.5rem;
      border-bottom-left-radius: 0.5rem;
      color: $white;
      transform: translateY(-50%);
      outline: none;

      &--left {
        right: 0;
        transform: translate(100%, -50%) rotate(180deg);
      }

      &--right {
        left: 0;
        transform: translate(-100%, -50%);
      }
    }

    &--right {
      .fc-composer--aside-r & {
        width: 100%;
      }
      .btn {
        color: $white;
      }

    }
    &--left {
      max-width: $sidebar-size + 14rem;

      .fc-composer--aside-l & {
        width: 100%;
      }
    }
  }


</style>
