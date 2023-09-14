<template>
  <div
    tabindex="0"
  >
    <div class="fc-composer"
     :class="[
      isLeftVisible && 'fc-composer--aside-l',
      isRightVisible && 'fc-composer--aside-r',
      !favoriteLayoutIds.length && 'fc-composer--no-favorites',
      'fc-composer__' + options.colorMode,
      'fc-composer__hide-layer-' + options.hideLayerMode,
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
            <i class="material-icons">{{ 'chevron_' + (isLeftVisible? 'right' : 'left') }}</i>
          </button>
        </div>

        <!--preview-->
        <preview
          :blocks="layers"
          :selected.sync="selected"
          ref="preview"
        />

        <!--layers-->
        <div class="fc-aside fc-aside--right">
          <div class="fc-aside__content">
            <header class="fc-aside__header">
              <button class="btn" @click="onToggleDeviceMode">
                <span class="material-icons">devices</span>
                </button>
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
            </header>
            <header class="fc-aside__header">
              <button class="btn narrow" @click="onSelectToggleAll" :disabled="!layers.length">
                <span class="material-icons">{{
                  checkedCount?
                    checkedCount === layers.length?
                      'check_box'
                    : 'indeterminate_check_box'
                 : 'check_box_outline_blank'
                }}</span>
              </button>
              <!-- <button class="btn narrow" @click="onUpBlock" :disabled="!checkedCount || layers.length < 2">
                <span class="material-icons">arrow_upward</span>
              </button>
              <button class="btn narrow" @click="onDownBlock" :disabled="!checkedCount || layers.length < 2">
                <span class="material-icons">arrow_downward</span>
              </button> -->
              <label class="fc-aside__header__label">
                {{layers.length}} 레이어
                <small v-if="warnCount || checkedCount">
                  (<template v-if="warnCount">{{warnCount}} 점검 필요</template>
                  <template v-if="warnCount && checkedCount"> ・ </template>
                  <template v-if="checkedCount">{{checkedCount}} 선택</template>)
                </small>
              </label>
              <button class="btn" @click="onToggleLayerVisibility" :disabled="!checkedCount">
                <span class="material-icons">{{ checkedCount && isEverySelectedLayerVisible? 'visibility_off' : 'visibility' }}</span>
              </button>
              <button class="btn" @click="onShowLayouts">
                <span class="material-icons">add</span>
              </button>
            </header>
            <div class="fc-aside__container">
              <!--
                @up="onUpBlock"
                @down="onDownBlock"
              -->
              <layers
                @hidden="onToggleLayerState"
                @selected-layer="onUpdateCurrentLayerIndex"
                @remove-layer="onRemoveLayer"
                @clone-layer="onCloneLayer"
                :layers="layers"
                :selected.sync="selected"
                ref="layers"
              />
            </div>
          </div>
          <button
            type="button"
            class="fc-aside__btn fc-aside__btn--right"
            @click="onToggleAside('right')">
            <i class="material-icons">{{ 'chevron_' + (isRightVisible? 'right' : 'left') }}</i>
          </button>
        </div>
      </div>
      <layouts
        ref="layouts"
        @add-layer="onAddLayer"
        @add-favorite-layout="onAddFavoriteLayout"
        :favoriteLayoutIds="favoriteLayoutIds"
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
      </div>
    </Dialog>
  </div>
</template>

<script>
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

  import Page from '../../page';
  import State from '../../state';

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
    data() {
      const page = new Page({})
      return {
        page,
        state: new State(),
        selected: 0,
        favoriteLayoutIds: [],
        showModal: false,
        isLeftVisible: true,
        isRightVisible: true,
        options: {
          colorMode: '',
          hideLayerMode: '',
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
    provide() {
      return {
        state: this.state
      }
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

        this.onUpdateCurrentLayerIndex(this.selected);
        this.focusEditor();
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
      onToggleAside(state) {
        if (state === 'left') {
          this.isLeftVisible = !this.isLeftVisible;
        } else {
          this.isRightVisible = !this.isRightVisible;
        }
      },
      onMoveSelectedLayer() {
        const $targetBlock = this.$refs.preview.$el.getElementsByClassName('fc-block')[this.selected];
        const $targetLayer = this.$refs.layers.$el.getElementsByClassName('fc-layer')[this.selected];

        $targetBlock && $targetBlock.scrollIntoView({ block: 'center' });
        $targetLayer && $targetLayer.scrollIntoView({ block: 'center' });
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
      // TODO what does focuses do?
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
        const usedLinks = document.querySelectorAll("link[rel='stylesheet']");

        const doc = this.$el.getElementsByClassName('fc-frame')[0].contentWindow.document;

        [...usedStyles, ...usedLinks].forEach(el => doc.head.appendChild(el.cloneNode(true)));
        doc.head.innerHTML += '<style>body{background:#fff;color:#000}</style>'

        doc.body.innerHTML = this.layerHtml;
      },
      onChangeDevice(deviceType) {
        this.deviceType = deviceType;
      },
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
        this.favoriteLayoutIds = this.localStorage['favoriteLayouts'];
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
    margin-left: auto;
    margin-right: auto;
    padding-top: $header-size;
    width: percentage(1);
    height: 100vh;
    font-size: $font-size;
    font-family: $font-base !important;
    background: $background;
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
        left: $sidebar-size + 10rem;
      }
    }
    &--aside-r {
      .fc-composer__content__btn--right {
        right: $sidebar-size;
      }
    }
    &--no-favorites {
      padding-top: $header-size * 0.5;

      > .fc-layout {
        top: 0;
      }
      .fc-aside--right {
        margin-top: $header-size * -0.5;

        .fc-aside__header {
          justify-content: flex-end;
        }
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
    z-index: 10000;
    box-sizing: border-box;
    /* width: 0; */
    width: 100%;
    max-width: $sidebar-size;
    color: $foreground;

    /* TODO rewrite markup (dirty class names/selectors) */
    &__header {
      width: 100%;
      display: flex;
      justify-content: space-evenly;

      margin-bottom: 0.4rem;
      line-height: 3.2rem;

      &__label {
        flex-grow: 10000;
        text-align: center;
      }
      small, .material-icons {
        vertical-align: top;
      }
    }
    &__content {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    &__container {
      overflow-x: hidden;
      overflow-y: scroll;
      box-sizing: border-box;
      padding: 1.2rem 0.9rem 11rem;
      height: percentage(1);
      background-color: $secondary;

      .fc-aside--right & {
        padding: 0;
      }
    }

    /* TODO rewrite markup (dirty class names/selectors) */
    /* (yes, whole header buttons) */
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
      color: $foreground;
      transform: translateY(-50%);
      outline: none;

      > .material-icons {
        margin: 0 -0.8rem;
      }
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
      margin-right: -$sidebar-size;

      .fc-composer--aside-r & {
        margin-right: 0;
      }
      .btn {
        color: $foreground;
        padding: 0.4rem;

        &:disabled {
          opacity: 0.3333;
        }
        &:hover {
          background: #8886;
        }

        label {
          padding: 0 0.4rem;
          line-height: 2.4rem;
        }
        &.narrow {
          padding-right: 0;
          padding-left: 0;
        }
      }

    }
    &--left {
      margin-left: -$sidebar-size - 8rem;
      max-width: $sidebar-size + 8rem;

      .fc-composer--aside-l & {
        margin-left: 0;
      }
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