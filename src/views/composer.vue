
<template>
  <div class="fc-composer"
   :class="[
    viewport ? { ['fc-composer--' + viewport]: viewport } : 'fc-composer--landscape',
    isVisible && 'fc-composer--aside'
  ]"
  >
    <composer-header/>
    <composer-content
      :layoutKits="layoutKits"
      :layers="layers"
    />

    <!--    <div class="side-area" v-if="isLayerKit">-->
<!--      <Layout :layouts="newLayoutKits" :width="`18rem`"-->
<!--              @select="onSelectLayout"/>-->
<!--    </div>-->
<!--    <div class="preview-area">-->
<!--      <preview-->
<!--        :layers="layers"-->
<!--        :selectedLayer="selectedLayer"-->
<!--        @select="onSelectLayer"-->
<!--        @toggleLayerKit="onToggleLayerKit"-->
<!--      />-->
<!--    </div>-->
<!--    <div class="editor-draggable-area" v-if="isActiveEditor" v-draggable>-->
<!--      <div style="position:relative;">-->
<!--        <div class="btn-group" style="position: absolute; right: 0;">-->
<!--          <button type="button" class="btn" @click="unSelectedLayer"><i class="far fa-window-close"></i></button>-->
<!--        </div>-->
<!--      </div>-->
<!--      <editor :layer="selectedLayer"/>-->
<!--    </div>-->
<!--    <button class="save-btn" @click="save"><i class="fas fa-save"></i></button>-->
  </div>
</template>

<script>
  import { cloneDeep } from 'lodash';
  import { uniqueId } from './../utils/utils';
  import EventBus from './../event-bus/event-bus';
  import marked from 'marked';
  import ComposerHeader from '../components/header.vue';
  import ComposerContent from '../components/content/content.vue';

  export default {
    name: 'composer',
    components: {
      ComposerHeader,
      ComposerContent,
    },
    mounted() {
      EventBus.$on('selected', (layoutKit) => {
        const layer = {
          id: uniqueId(),
          layout: layoutKit,
          values: cloneDeep(layoutKit.values) || {},
        };

        this.layers.push(layer);
      });

      EventBus.$on('toggleMenu', () => {
        this.isVisible = !this.isVisible;
      });
    },
    computed: {
      layerHtml() {
        const html = this.layers
          .map(
            layer => `
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
        layoutMap: {},
        layers: [],
        editorLayout: {},
        editorLayoutIndex: -1,

        viewport: '',
        isVisible: true, // 작업 편의를 위해 임시로
      };
    },
    methods: {
      removeLayer(layer, layerIndex) {
        if (layerIndex !== -1) {
          this.layers.splice(layerIndex, 1);
        }
      },
      setLayoutKits(layoutKits) {
        this.layoutKits = layoutKits;
      },
      nextLayerId() {
        const seq = (this._blockIdSeq = this._blockIdSeq ? ++this._blockIdSeq : 1);
        const nonce = Math.random()
          .toString(36)
          .substr(2, 9);
        return `fc-block-${seq}-${nonce}`;
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
         * nextLayerId -> 밖으로 빼서처리해도 될거같은데...
         * @type {any}
         */
        this.layers = Object.assign([], layerBlockData.map(layer => Object.assign({id: this.nextLayerId()}, layer, {layout: this.layoutMap[layer.layout]})));
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
