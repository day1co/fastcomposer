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
      <message-toast
        :message="notification.message"
        :type="notification.type"/>
      <composer-header
        :layouts="layoutModels"
        :layerCount="layers.length"
        :warnCount="layers.filter(layer => layer.hasSyntaxErrorTags).length"
        :notificationMessage="notification.message"
        :notificationType="notification.type"/>
      <div class="fc-composer__content">
        <composer-aside :className="'left'">
          <editor v-show="currentLayer" :layer="currentLayer" ref="editor" />
        </composer-aside>
        <preview
          :layers="layers"
          ref="preview"
        />
        <composer-aside :className="'right'" :checkedCount="layers.filter(layer => layer.isChecked).length">
          <layers
            :layers="layers"
            :currentLayerIndex="currentLayerIndex"
            ref="layers"
          />
        </composer-aside>
      </div>

      <layouts
        :layouts="layouts"
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
  import MessageToast from './../components/common/message-toast';

  export default {
    components: {
      MessageToast,
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

      this.$el.focus();
    },
    created() {
      EventBus.$on('up-block', this.upBlock);
      EventBus.$on('down-block', this.downBlock);
      EventBus.$on('selected-layer', this.onUpdateCurrentLayerIndex);
      EventBus.$on('add-layer', this.onAddLayer);
      EventBus.$on('remove-layer', this.onRemoveLayer);
      EventBus.$on('clone-layer', this.onCloneLayer);
      EventBus.$on('toggle-aside', this.onToggleAside);
      EventBus.$on('save', this.onSave);
      EventBus.$on('move-selected-layer',this.onMoveSelectedLayer);
      EventBus.$on('fc-upload', this.onUploadFile);
      EventBus.$on('show-layout-panel', this.onShowLayouts);
      EventBus.$on('clear', this.clearMessageToast);
      EventBus.$on('showInfoTags', this.onShowModal);
      EventBus.$on('hidden', this.onToggleLayerState);
      EventBus.$on('validate-layer', this.onValidateLayer);
    },
    computed: {
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
      scrollPoint() {
        return this.$el.getElementsByClassName('fc-layer')[this.currentLayerIndex].offsetTop;
      }
    },
    data() {
      return {
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
        }
      };
    },
    methods: {
      upBlock() {
        const checkedLayer = this.layers.filter(layer => layer.isChecked);
        const { uniqueId } = checkedLayer[0];
        const checkedFirstIndex = this.layers.findIndex(layer => layer.uniqueId === uniqueId);

        if (checkedFirstIndex) {
          const targetUniqueId = this.layers[checkedFirstIndex - 1].uniqueId;
          this.layers = [...this.layers.filter(layer => !layer.isChecked)];
          const targetIndex = this.layers.findIndex(layer => layer.uniqueId === targetUniqueId);
          this.layers.splice(targetIndex, 0, ...checkedLayer);
          EventBus.$emit('selected-layer', targetIndex);
          EventBus.$emit('move-selected-layer');
        }
      },
      downBlock() {
        const checkedLayer = this.layers.filter(layer => layer.isChecked);
        const { uniqueId } = checkedLayer[checkedLayer.length - 1];
        const checkedLastIndex = this.layers.findIndex(layer => layer.uniqueId === uniqueId);

        if (checkedLastIndex < this.layers.length - 1) {
          const targetUniqueId = this.layers[checkedLastIndex + 1].uniqueId;
          this.layers = [...this.layers.filter(layer => !layer.isChecked)];
          const targetIndex = this.layers.findIndex(layer => layer.uniqueId === targetUniqueId);
          this.layers.splice(targetIndex + 1, 0, ...checkedLayer);
          EventBus.$emit('selected-layer', checkedLastIndex + 1);
          EventBus.$emit('move-selected-layer');
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
      clearMessageToast() {
        this.notification.message = '';
      },
      onUpdateCurrentLayerIndex(index, isClick) {
        this.currentLayerIndex = index;

        if (isClick !== true) {
          const [, el] = this.$el.querySelectorAll('.fc-aside__container');

          if (this.$el.querySelector('.smooth-dnd-container').children.length) {
            el.scrollTop = this.$el.querySelector('.smooth-dnd-container').children[index].offsetTop;
          }
        }
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
        EventBus.$emit('selected-layer', this.currentLayerIndex);
        this.focusEditor();
      },
      onRemoveLayer(index) {
        if (index !== -1) {
          this.layers.splice(index, 1);
          if (index < this.layers.length) {
            this.currentLayerIndex = index;
            EventBus.$emit('selected-layer', this.currentLayerIndex);
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

          this.currentLayerIndex = index + 1;
          EventBus.$emit('selected-layer', this.currentLayerIndex);
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
          EventBus.$emit('selected-layer', 0);
        }
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
      getInvalidCount() {
        let count = 0;

        this.layers.forEach(({ layout, values }) => {
          layout.params.forEach(({ isRequired, name, type, params }) => {
            // 일반
            if (isRequired && values[name] === '' || values[name] === undefined) {
              count+=1;
            }

            // list type
            if (type === 'list') {
              params.forEach(({ isRequired, name }) => {
                if (isRequired) {
                  values[name].forEach(child => {
                    if (child[name] === '' || child[name] === undefined) {
                      count+=1;
                    }
                  });
                }
              });
            }
          });
        });
        return count;
      },
      onSave() {
        const invalidCount = this.getInvalidCount();
        const layerHtml = this.layerHtml;
        // old format: replace layout object => layout id
        //const layers = this.layers.map(layer => Object.assign({}, layer, {layout: layer.layout.id}));

        // new format: embed layout itself
        const layerJson = JSON.stringify(this.layers, null, 2);

        // TODO: save html only!
        // AS-IS: save generated html with source json
        this.$emit('save', layerHtml, layerJson, invalidCount);
      },
    },
    beforeDestroy() {
      EventBus.$off();
    }
  };
</script>

<style lang="scss">
  @import './../assets/scss/style.scss';

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
      padding-left: $sidebar-size + 14rem;
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
</style>
