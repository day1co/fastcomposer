<template>
  <div class="fc-aside__list">
    <Container @drop="onDrop" :animation-duration="200">
      <Draggable v-for="(layer, layerIndex) in layers" :key="layerIndex">
        <button class="fc-layout__item" @click="select(layer, layerIndex)">
          <img :src="layer.layout.icon" alt="" />
          <span class="fc-layout__item__info">
            <strong class="fc-layout__item__name">{{ layer.layout.id }}</strong>
            {{ layer.layout.description }}
          </span>
          <div class="fc-layout__utils">
            <button class="fc-block__utils__btn" @click="removeLayer(layer, index)">
              <i class="material-icons">&#xE872;</i>
            </button>
          </div>
        </button>
      </Draggable>
    </Container>
  </div>
</template>
<script>
  import { Container, Draggable } from "vue-smooth-dnd";
  import EventBus from './../../../../event-bus/event-bus';

  const applyDrag = (arr, dragResult) => {
    const { removedIndex, addedIndex, payload } = dragResult;
    if (removedIndex === null && addedIndex === null) return arr;

    const result = arr;
    let itemToAdd = payload;

    if (removedIndex !== null) {
      itemToAdd = result.splice(removedIndex, 1)[0];
    }

    if (addedIndex !== null) {
      result.splice(addedIndex, 0, itemToAdd);
    }

    return result;
  };

  export default {
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
    methods: {
      select(layer, layerIndex) {
        EventBus.$emit('moveSelectedLayer', layerIndex);
        EventBus.$emit('selectedLayer', layer);

        // console.log(layer);
        // console.dir(layerIndex);
      },
      onDrop(dropResult) {
        this.layers = applyDrag(this.layers, dropResult);
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../../../assets/scss/utils/utilities.scss';
  .fc-aside {
    &__list {
      overflow: scroll;
      box-sizing: border-box;
      padding: 1.2rem 0.9rem;
      height: percentage(1);
      background-color: $secondary;

      li {
        & + li {
          margin-top: 1rem;
        }
      }
    }

    .fc-layout {
      &__item {
        display: flex;
        flex-direction: row;
        width: percentage(1);
        margin-bottom: 0.5rem;
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
  }
</style>
