<template>
  <div class="fc-pane fc-layers">
    <header class="fc-pane-title">
      <button
        class="fc-pane-title-button"
        style="margin-left: -0.2rem"
        :disabled="!layers.length"
        @click="checkAll">
        <span class="material-icons">{{
          checkedCount?
            checkedCount === layers.length?
              'check_box'
            : 'indeterminate_check_box'
        : 'check_box_outline_blank'
        }}</span>
      </button>
      <!-- <button class="btn narrow" @click="onUpBlock" :disabled="!checked.length || layers.length < 2">
        <span class="material-icons">arrow_upward</span>
      </button>
      <button class="btn narrow" @click="onDownBlock" :disabled="!checked.length || layers.length < 2">
        <span class="material-icons">arrow_downward</span>
      </button> -->
      <label class="fc-pane-title-label">
        레이어
        {{layers.length}}개
        <template v-if="warnCount">
          <i class="material-icons">warning</i> {{ warnCount }}
        </template>
        <template v-if="checkedCount">
          <i class="material-icons">check_box</i> {{ checkedCount }}
        </template>
      </label>
      <button
        class="fc-pane-title-button"
        @click="moveCheckedUp"
        :disabled="!checkedCount || checkedCount === layers.length || areEveryCheckedLayersAtTop">
        <span class="material-icons">arrow_upward</span>
      </button>
      <button
        class="fc-pane-title-button"
        @click="moveCheckedDown"
        :disabled="!checkedCount || checkedCount === layers.length || areEveryCheckedLayersAtBottom">
        <span class="material-icons">arrow_downward</span>
      </button>
      <button class="fc-pane-title-button" :disabled="!checkedCount" @click="hideChecked">
        <span class="material-icons">{{ checkedCount && areEveryCheckedLayerVisible? 'visibility_off' : 'visibility' }}</span>
      </button>
      <button class="fc-pane-title-button" @click="$emit('toggle-layouts')"> <!-- @click="onShowLayouts" -->
        <span class="material-icons">add</span>
      </button>
    </header>
    <Container class="fc-pane-content" @drop="onDrop" :get-ghost-parent="getGhostParent">
      <Draggable
        :class="{
          'fc-layer': true,
          'fc-layer--active': index === selected,
          'fc-layer--checked': checked[layer.id],
          'fc-layer--hidden': layer.meta.hidden,
          'fc-layer--invalid': layer.meta.invalid.length,
          'has-syntax-error-tags': layer.hasSyntaxErrorTags
        }"
        v-for="(layer, index) in page.state"
        ref="layers"
        :key="index">
        <div class="fc-layer-info" v-if="layer.layout" @click="$emit('selected', index)">
          <label :for="`layer-${layer.id}`">
            <input
              :id="`layer-${layer.id}`"
              type="checkbox"
              v-model="checked[layer.id]"
              style="display: none"
              @click="e => $nextTick(() => onCheck(layer, e))" />
            <i class="material-icons">{{ checked[layer.id]? 'check_box' : 'check_box_outline_blank' }}</i>
          </label>
          <layout-info :layout="layer.layout" :index="index" class="small"></layout-info>
        </div>
        <div class="fc-layer-buttons">
          <button class="fc-layer-action" @click="state.act('layer.hide', layer.path)">
            <i class="material-icons">
              {{ layer.meta.hidden? 'visibility_off' : 'visibility' }}
            </i>
          </button>
          <button class="fc-layer-action" @click="duplicate(layer.path, index)">
            <i class="material-icons">file_copy</i>
          </button>
          <button class="fc-layer-action" @click="remove(layer.path, index)">
            <i class="material-icons">delete</i>
          </button>
        </div>
      </Draggable>
    </Container>
  </div>
</template>
<script>
  import Page from '../../page'
  import State from '../../state'
  import LayoutInfo from '../components/layout-info.vue';
  import { Container, Draggable } from "vue-smooth-dnd";
  import EventBus from '../event-bus.vue';
  import { Paths } from '../../page/path'

  export default {
    components: {
      LayoutInfo,
      Container,
      Draggable,
    },
    props: {
      page: Page,
      state: State,
      selected: {
        type: Number,
        default() {
          return -1
        }
      }
    },
    data: () => ({
      checked: {},
      lastClickedId: null
    }),
    computed: {
      layers() {
        return this.page?.state ?? []
      },
      checkedLayers() {
        return Object.entries(this.checked)
          .map(([ id, v ]) => {
            if(!v) return
            const index = this.page.state.findIndex(l => l.id === id)
            if(index == null) return
            const layer = this.page.state[index]
            if(layer == null) return
            return { index, layer }
          })
          .sort((a, b) => a.index - b.index)
          .filter(l => l)
      },
      areCheckedLayersContinuous() {
        return this.checkedLayers.reduce((p, { index: c }, i, l) => {
          if(!p) return c
          else if(p < 0) return p
          else if((c - p) === 1) return c
          else return -1
        }, null) > 0
      },
      checkedCount() {
        return this.checkedLayers.length
      },
      areEveryCheckedLayerVisible() {
        return this.checkedLayers.every(l => !l.layer.meta.hidden)
      },
      areEveryCheckedLayersAtTop() {
        const last = this.checkedLayers[this.checkedLayers.length - 1]?.index
        return this.checkedLayers.length === (last + 1)
      },
      areEveryCheckedLayersAtBottom() {
        const first = this.checkedLayers[0]?.index
        return this.checkedLayers.length === (this.page.state.length - first)
      },
      warnCount() {
        return this.page.state.reduce((p, c) => p + (c.meta.invalid.length > 0), 0)
      }
    },
    methods: {
      onDrop({ removedIndex, addedIndex, payload }) {
        if(removedIndex === null && addedIndex === null)
          return

        // this.$emit('selected', addedIndex)

        if(removedIndex === addedIndex)
          return

        this.state.act('layer.reorder', this.page.state[removedIndex].path, this.page.state[addedIndex].path)
      },
      duplicate(path) {
        this.state.act('layer.duplicate', path)
      },
      remove(path, index) {
        this.state.act('layer.remove', path)
        // this.$emit('selected', this.page.pathToIndex(nextFocus))
      },
      getGhostParent(){
        return document.body;
      },
      scroll(index) {
        this.$refs.layers[index]?.$el?.scrollIntoViewIfNeeded?.({ block: 'nearest' })
      },
      checkAll() {
        if(this.checkedCount === this.layers.length) {
          this.$set(this, 'checked', {})
        } else {
          this.$set(this, 'checked', Object.fromEntries(this.layers.map(_ => [_.id, true])))
        }
      },
      hideChecked() {
        const paths = new Paths(this.checkedLayers.map(_ => _.layer.path))
        this.state.act('layer.hide', paths)
      },
      moveCheckedUp() {
        const paths = new Paths(this.checkedLayers.map(_ => _.layer.path))
        const firstIndex = Math.max(0, this.checkedLayers[0].index - 1)
        const target = this.page.indexToPath(firstIndex)

        this.state.act('layer.reorder', paths, target)
      },
      moveCheckedDown() {
        const paths = new Paths(this.checkedLayers.map(_ => _.layer.path))
        const lastIndex = Math.min(this.page.state.length - 1, this.checkedLayers[this.checkedLayers.length - 1].index + 1)
        const target = this.page.indexToPath(lastIndex)

        this.state.act('layer.reorder', paths, target)
      },
      onCheck(layer, e) {
        const findIndex = id => this.page.state.findIndex(layer => layer.id === id)

        const shift = e.shiftKey

        const id = layer.id
        const checked = !this.checked[id]

        const from = findIndex(this.lastClickedId)
        console.log(id, from, this.lastClickedId, checked, shift)
        // if(from < 0) {
        //   this.lastClickedId = null
        //   return
        // }
        //
        if(shift && this.lastClickedId) {
          if(this.checkedCount) {
            const to = findIndex(id)
            const layers = this.page.state.slice(Math.min(from, to), Math.max(from, to) + 1)
            const checked = Object.fromEntries(layers.map(layer => [ layer.id, true ]))

            e.preventDefault()
            this.$nextTick(() => this.$set(this, 'checked', checked))
          } else {
            this.lastClickedId = id
          }
        } else if(checked) {
          this.lastClickedId = id
        } else {
          this.lastClickedId = null
        }
      }
    }
  }
</script>
<style lang="scss">
  @import '../assets/scss/utils/utilities';

  .fc-layer {
    position: relative;
    margin: 0.2rem 0 0 0.2rem;
    padding: 0;
    cursor: pointer;
    background: $primary;
    font-size: 1.4rem;

    &:focus {
      outline-style: none;
    }
    &.has-syntax-error-tags {
      background-color: #e65100;
      .__item__group {
        background-color: #e65100;
      }
    }
    &--active {
      background: $primary-active;
      box-shadow: 0 0 0 0.2rem #ffffff;
    }
    &--hidden {
      .fc-layout-info {
        opacity: 0.5;
        strong {
          text-decoration: line-through;
        }
      }
      .fc-layer-buttons {
        opacity: 0.2;
      }
    }
    &--invalid {
      background: $invalid;
      &.fc-layer--active {
        background: $invalid-active;
      }
    }
    /* TODO cleanup */
    &--checked {
      > .fc-layer-info label .material-icons {
        opacity: 0.9;
      }
    }
    &-info {
      display: flex;
      align-items: stretch;
      flex-direction: row;
      width: percentage(1);
      color: $foreground;
      line-height: 2rem;

      label {
        display: inline-flex;
        align-self: stretch;
        align-items: center;

        > .material-icons {
          vertical-align: top;
          color: $foreground;
          opacity: 0.4;
        }
      }
      .fc-layout-info {
        padding: 0.4rem 0;
      }
    }

    &-buttons {
      position: absolute;
      top: 0.4rem;
      right: 0.4rem;
      opacity: 0.4;

      &__btn {
        color: $foreground;
      }
    }
  }
</style>
