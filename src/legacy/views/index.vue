<template>
  <div
    tabindex="0"
  >
    <div class="fcc-composer"
     :class="[
      'fcc-composer--aside-l',
      'fcc-composer--aside-r',
      !favoriteLayoutIds.length && 'fcc-composer--no-favorites',
      'fcc-composer__' + options.colorMode,
      'fcc-composer__hide-layer-' + options.hideLayerMode,
      options.simpleFavorites && 'fcc-composer__simple-favorites',
      options.simpleLayers && 'fcc-composer__simple-layers'
    ]"
    >
      <div class="fcc-tooltip">
        <div class="fcc-tooltip__content"></div>
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
        @add="onAddLayer"
        :favoriteLayoutIds="favoriteLayoutIds"
        :layouts="layoutModels"
        :notificationMessage="notification.message"
        :notificationType="notification.type">

        <!-- <button class="btn" @click="onToggleDeviceMode">
          <span class="material-icons">devices</span>
        </button> -->
        <button class="btn" @click="currentModal = 'changelog'">
          <span class="material-icons">update</span>
        </button>
        <button class="btn" @click="currentModal = 'config'">
          <span class="material-icons">settings</span>
        </button>
        <button class="btn" @click="page.validateAll()">
          <span class="material-icons">check</span>
          <label>검증</label>
        </button>
        <button class="btn" @click="onSave">
          <span class="material-icons">save</span>
          <label>저장</label>
        </button>
      </composer-header>

      <splitpanes @resize="onHorizontalResize">

        <pane class="scrollable" min-size="20" :size="options.horizontalSizes?.[0]">
          <editor
            v-if="currentLayer"
            :layer="currentLayer"
            :page="page"
            :state="state"
            ref="editor" />
        </pane>

        <pane class="scrollable" min-size="20" :size="options.horizontalSizes?.[1]">
          <preview
            :blocks="layers"
            :selected="page.focusedIndex"
            @selected="index => page.setFocusByIndex(index)"
            ref="preview" />
        </pane>

        <pane min-size="20" :size="options.horizontalSizes?.[2]">

          <splitpanes horizontal @resize="onVerticalResize">

            <pane :size="options.verticalSizes?.[0]" style="position: relative;">
              <!--
                @up="onUpBlock"
                @down="onDownBlock"
              -->
              <layers
                :page="page"
                :state="state"
                :selected="page.focusedIndex"
                @selected="index => page.setFocusByIndex(index)"
                @toggle-layouts="toggleLayouts()"
                @toggle-snippets="toggleSnippets()"
                @save-snippets="onSaveSnippet"
                ref="layers" />

              <snippets
                :page="page"
                v-if="currentTab === 'snippets'"
                :snippets="snippets"
                @add-layers="onAddLayers" />

              <layouts
                v-if="currentTab === 'layouts'"
                @add-layer="onAddLayer"
                @add-favorite-layout="onAddFavoriteLayout"
                :favoriteLayoutIds="favoriteLayoutIds"
                :layouts="layouts"
                ref="layouts" />

            </pane>

            <pane
              :size="options.verticalSizes?.[1]"
              style="min-height: 3.2rem">
              <history :state="state" />
            </pane>

          </splitpanes>

        </pane>

      </splitpanes>

      <Dialog :visible="currentModal === 'changelog'" @close="currentModal = null">
        <div slot="header">
          <h3> 패치노트 </h3>
        </div>
        <changelog slot="main" />
      </Dialog>

      <Dialog :visible="currentModal === 'config'" @close="currentModal = null">
        <div slot="header">
          <h3> FastComposer 설정 </h3>
        </div>
        <div slot="main">
          <p class="fcc-option-row">
            <label for="fcc-options-colormode">
              테마:
            </label>
            <select v-model="options.colorMode" id="fcc-options-colormode">
              <option value=""> 자동 </option>
              <option value="light"> 밝게 </option>
              <option value="dark"> 어둡게 </option>
            </select>
          </p>
          <p class="fcc-option-row">
            <label for="fcc-options-hidelayermode">
              미리보기 영역에서 <i class="material-icons">visibility_off</i> 레이어를:
            </label>
            <select v-model="options.hideLayerMode" id="fcc-options-hidelayermode">
              <option value=""> 흐리게 보이기 </option>
              <option value="hatched"> 흐리게 + 빗금 </option>
              <option value="gutter-only"> 레이어 정보만 보이기 </option>
              <option value="hide"> 완전히 숨기기 </option>
            </select>
          </p>
          <p class="fcc-option-row">
            <label for="fcc-options-simplefavorites">
              레이아웃 즐겨찾기 얇게 표시:
            </label>
            <input
              type="checkbox"
              v-model="options.simpleFavorites"
              id="fcc-options-simplefavorites" />
          </p>
          <p class="fcc-option-row">
            <label for="fcc-options-simplelayers">
              레이어 한 줄로 표시:
            </label>
            <input
              type="checkbox"
              v-model="options.simpleLayers"
              id="fcc-options-simplelayers" />
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
  import Editor from './editor.vue';
  import Preview from './preview.vue';
  import Layouts from './layouts.vue';
  import Snippets from './snippets.vue';
  import Layers from './layers.vue';
  import History from './history/index.vue';
  import Changelog from './changelog.vue'

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
      Snippets,
      Layers,
      History,
      Dialog,
      Changelog,
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
      return {
        page: new Page({}),
        state: new State(),
        selected: 0,
        favoriteLayoutIds: [],
        snippets: [],
        currentModal: null,
        currentTab: false,
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
      onToggleLayerState(index) {
        this.state.act('layer.hide', this.layers[index].path)
      },
      onClearToast() {
        this.notification.message = '';
      },
      onAddLayer(layout) {
        this.state.act('layer.new', this.currentLayer?.path, layout)

        this.focusEditor()
        this.currentTab = false
      },
      onAddLayers(snippet) {
        const remembered = this.state.act('layer.restore', this.currentLayer?.path, snippet)

        this.focusEditor()
        this.currentTab = false

        const ids = remembered.destination.paths.map(_ => _.layer)
        this.$refs.layers.setChecked(ids)
      },
      onSaveSnippet(layers) {
        const title = prompt('스니펫 제목을 입력하세요')
        if(!title) return

        this.snippets.push({
          title,
          layers: layers.map(_ => ({ layout: _.layer.layout.id, values: _.layer.values }))
        })
      },
      toggleSnippets() {
        this.currentTab = this.currentTab? null : 'snippets'
      },
      toggleLayouts() {
        this.currentTab = this.currentTab? null : 'layouts'
        if(this.currentTab)
          this.$nextTick(() => this.$refs.layouts.clear())
      },
      onRemoveLayer(index) {
        this.state.act('layer.remove', this.layers[index].path)
      },
      onMoveSelectedLayer(index) {
        this.$refs.preview.scroll(index)
        this.$refs.layers.scroll(index)
      },
      onUploadFile(fileInfo, callback) {
        // FIXME ???
        this.$emit('uploadFile', fileInfo, callback);
      },
      setLayouts(layouts) {
        this.layouts = layouts;
      },
      focusEditor() {
        // this.$refs.editor.focus();
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
        const layerJson = JSON.stringify(this.page.dump(true), null, 2)

        // TODO: save html only!
        // AS-IS: save generated html with source json
        this.$emit('save', layerHtml, layerJson);
      },
      loadLayers() {
        const usedStyles = document.querySelectorAll("style[type='text/css']");
        const usedLinks = document.querySelectorAll("link[rel='stylesheet']");

        const doc = this.$el.getElementsByClassName('fcc-frame')[0].contentWindow.document;

        [...usedStyles, ...usedLinks].forEach(el => doc.head.appendChild(el.cloneNode(true)));
        doc.head.innerHTML += '<style>body{background:#fff;color:#000}</style>'

        doc.body.innerHTML = this.layerHtml;
      },
      onHorizontalResize(e) {
        this.options.horizontalSizes = e.map(_ => _.size)
      },
      onVerticalResize(e) {
        this.options.verticalSizes = e.map(_ => _.size)
      },
      // legacy api
      setLayerBlockData(state) {
        this.page.replaceState(state)
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
        return this.page.currentLayer;
      },
      layerHtml() {
        return this.layers.filter(layer => !layer.hidden).map(layer => `
            <section class="fc-block fc-layout fc-layout-${layer.layout.id}">
              ${layer.render()}
            </section>`,
          ).join('\n');
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
      try {
        this.snippets = JSON.parse(localStorage['fastcomposer-snippets']);
      } catch(e) {
        this.snippets = []
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
      ['page.focusedIndex'](to) {
        this.$nextTick(() => this.onMoveSelectedLayer(to))
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
      snippets: {
        handler(to) {
          try {
            localStorage['fastcomposer-snippets'] = JSON.stringify(to) ?? []
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

  .fcc-tooltip {
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
      min-inline-size: max-content;
      background-color: #eaeaea;
      color: #111;
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

  .fcc-composer {
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
      .fcc-composer__content {
        margin-left: 0;
        margin-right: 0;
      }
    }

    &--no-favorites {
      > .fcc-layout {
        top: 0;
      }
    }

  }

  .fcc-layout-broken {
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

  .fcc-option-row {
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
