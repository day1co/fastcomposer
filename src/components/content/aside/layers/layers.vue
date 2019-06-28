<template>
  <div class="fc-layer">
    <div class="fc-layer__list">
      <Container @drop="drop" :get-ghost-parent="getGhostParent" :remove-on-drop-out="true">
        <Draggable v-for="(layer, index) in layers" :key="index">
          <button class="fc-layer__list__item" :class="{'fc-layer__list__item--active': index === currentLayerIndex}" @click="select(index)">
            <div class="fc-layer__list__item__group">
              <img :src="layer.layout.icon" alt="" />
              <span class="fc-layer__list__item__group__info">
                <strong class="fc-layer__list__item__group__name">{{ layer.layout.id }}</strong>
                {{ layer.layout.description }}
                </span>
              <div class="fc-layer__list__utils">
                <button class="fc-layer__list__utils__btn" @click="removeLayer(layer, index)">
                  <i class="material-icons">&#xE872;</i>
                </button>
              </div>
            </div>
          </button>
        </Draggable>
      </Container>
    </div>
  </div>
</template>
<script>
  import { Container, Draggable } from "vue-smooth-dnd";
  import EventBus from './../../../../event-bus/event-bus';

  export default {
    created() {
      EventBus.$on('remove-selected-layer', this.removeSelectedLayer);
    },
    components: {
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
    },
    data() {
      return {
        dropResult: null,
        currentLayerIndex: -1
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
      select(index) {
        this.currentLayerIndex = index;
        EventBus.$emit('selected-layer', index);
        EventBus.$emit('move-selected-layer');
      },
      drop(dropResult) {
        this.dropResult = dropResult;
        this.layers = this.applyDrag;
      },
      getGhostParent(){
        return document.body;
      },
      removeSelectedLayer(index) {
        this.currentLayerIndex = index;
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../../../assets/scss/utils/utilities.scss';

  .fc-layer {
    width: 40%;
    &__list {
      overflow: scroll;
      box-sizing: border-box;
      padding: 1.2rem 0.9rem;
      height: percentage(1);
      background-color: $secondary;
      &__item {
        width: 100%;
        border: 3px solid #ffffff;
        &--active {
          border: 3px solid #f74982;
        }
        &__group {
          display: flex;
          flex-direction: row;
          width: percentage(1);
          background: #0fd961;
          color: $white;
          &__info {
            flex: 1;
            padding-top: 0.5rem;
            padding-left: 1rem;
            padding-bottom: 0.5rem;
            text-align: left;
          }
          &__name {
            display: block;
            margin-bottom: 0.5rem;
          }
        }
      }
      .smooth-dnd-draggable-wrapper {
        & + .smooth-dnd-draggable-wrapper {
          margin-top: 0.5rem;
        }
      }
    }
  }
</style>
