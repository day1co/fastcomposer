<template>
  <Container @drop="onDrop" :get-ghost-parent="getGhostParent">
    <Draggable class="fc-layer" v-for="(layer, index) in layers" :key="index">
      <div
        class="__item"
        :class="{
          '__item--active': index === currentLayerIndex,
          '__item--checked': layer.isChecked,
          '__item--hidden': layer.hidden,
          'has-syntax-error-tags': layer.hasSyntaxErrorTags
        }"
        tabindex="0"
        @keydown.exact.enter.prevent="focusEditor"
        @keydown.exact.shift.up="updateCheckedState(currentLayerIndex - 1, $event)"
        @keydown.exact.shift.down="updateCheckedState(currentLayerIndex + 1, $event)"
        @keydown.exact.shift.alt.up="onUpBlock"
        @keydown.exact.shift.alt.down="onDownBlock"
        @keydown.exact.up.prevent="onSelect(currentLayerIndex - 1)"
        @keydown.exact.down.prevent="onSelect(currentLayerIndex + 1)"
        @keydown.exact.page-up.prevent="onSelect(currentLayerIndex - 5)"
        @keydown.exact.page-down.prevent="onSelect(currentLayerIndex + 5)"
        @keydown.exact.home.prevent="onSelect(0)"
        @keydown.exact.end.prevent="onSelect(layers.length - 1)"
      >
        <div class="__item__group" v-if="layer.layout" @click="onSelect(index, $event, layer)">
          <label :for="`layer-${index}`" >
            <input :id="`layer-${index}`" type="checkbox" v-model="layer.isChecked" style="display: none" />
            <i class="material-icons">{{ layer.isChecked? 'check_box' : 'check_box_outline_blank' }}</i>
          </label>
          <layout-info :layout="layer.layout" class="small"></layout-info>
        </div>
        <div class="__utils">
          <button class="__utils__btn" @click="onToggle(index)">
            <i class="material-icons">
              {{ getLayoutStateIconStyle(layer) }}
            </i>
          </button>
          <button class="__utils__btn" @click="onCloneLayer(index)">
            <i class="material-icons">file_copy</i>
          </button>
          <button class="__utils__btn" @click="onRemoveLayer(index)">
            <i class="material-icons">delete</i>
          </button>
        </div>
      </div>
    </Draggable>
  </Container>
</template>
<script>
  import LayoutInfo from '../components/layout-info.vue';
  import { Container, Draggable } from "vue-smooth-dnd";
  import EventBus from '../event-bus.vue';

  export default {
    components: {
      LayoutInfo,
      Container,
      Draggable,
    },
    props: {
      layers: {
        type: Array,
        default() {
          return []
        }
      },
      currentLayerIndex: {
        type: Number,
        default() {
          return -1
        }
      }
    },
    data() {
      return {
        dropResult: null,
        checkedHistory: null,
      }
    },
    computed: {
      applyDrag() {
        const { removedIndex, addedIndex, payload } = this.dropResult;
        if (removedIndex === null && addedIndex === null) return this.layers;

        const result = this.layers;
        let itemToAdd = payload;

        if (removedIndex !== null) {
          itemToAdd = result.splice(removedIndex, 1)[0];
        }

        if (addedIndex !== null) {
          result.splice(addedIndex, 0, itemToAdd);
        }

        return result;
      }
    },
    methods: {
      onUpBlock() {
        this.$emit('up');
      },
      onDownBlock() {
        this.$emit('down');
      },
      updateCheckedState(index, event) {
        let newIndex = Math.min(Math.max(index, 0), this.layers.length - 1);

        if (this.checkedHistory !== event.key) {
          if (event.key === 'ArrowUp') {
            newIndex += 1;
          } else {
            newIndex -= 1;
          }
        }

        this.layers[newIndex].isChecked = !this.layers[newIndex].isChecked;

        this.$emit('selected-layer', newIndex);
        this.$emit('move-selected-layer');

        this.checkedHistory = event.key;
      },
      resetCheckedHistory() {
        this.checkedHistory = null;
      },
      getLayoutStateIconStyle({ hidden }) {
        return hidden ? 'visibility_off' : 'visibility';
      },
      onSelect(index) {
        const newIndex = Math.min(Math.max(index, 0), this.layers.length - 1);

        this.$emit('update:currentLayerIndex', newIndex);
        this.resetCheckedHistory();
      },
      onDrop(dropResult) {
        this.dropResult = dropResult;
        this.layers = this.applyDrag;
        this.$emit('update:currentLayerIndex', dropResult.addedIndex);
      },
      getGhostParent(){
        return document.body;
      },
      onCloneLayer(index) {
        this.$emit('clone-layer', index);
      },
      onRemoveLayer(index) {
        this.$emit('remove-layer', index);
      },
      focus() {
        // XXX: focus the selected layer
        this.$el.focus();
        const el = this.$el.querySelector('.__item--active');
        if (el) {
          el.focus();
        }
      },
      focusEditor() {
        // XXX: focus to editor
        EventBus.$emit('focus-editor');
      },
      onToggle(index) {
        this.$emit('hidden', index, !this.layers[index].hidden);
      }
    },
  }
</script>
<style lang="scss">
  @import '../assets/scss/utils/utilities';
  .fc-layer {
    overflow: visible !important;
    z-index: 10001 !important; /* overrided INLINE by vue plugin :facepalm: */
  }
  .fc-layer .__item {
    position: relative;
    margin: 0.3rem 0 0 0.3rem;
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
      box-shadow: 0 0 0 0.3rem #ffffff;
    }
    &--hidden {
      .fc-layout-info {
        opacity: 0.5;
        strong {
          text-decoration: line-through;
        }
      }
      .__utils {
        opacity: 0.2;
      }
    }
    /* TODO cleanup */
    &--checked {
      .__item__group label .material-icons {
        opacity: 0.9;
      }
    }
    &__group {
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

    .__utils {
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
