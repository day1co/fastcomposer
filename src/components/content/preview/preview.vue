<template>
  <main>
    <Container @drop="onDrop" drag-handle-selector=".row-drag-handle" :animation-duration="200">
      <Draggable v-for="(layer, layerIndex) in layers" :key="layerIndex">
        <layer-preview
          :key="'layer-' + layerIndex"
          :layer="layer"
        />
      </Draggable>
    </Container>
  </main>
</template>

<script>
  import LayerPreview from './layer-preview.vue';
  import { Container, Draggable } from "vue-smooth-dnd";

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
    name: 'preview',
    components: {
      LayerPreview,
      Container,
      Draggable,
    },
    props: {
      layers: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    methods: {
      onDrop(dropResult) {
        this.layers = applyDrag(this.layers, dropResult);
      },
    },
  };
</script>

<style lang="scss">
  @import '../../../assets/scss/utils/utilities.scss';
  .fc-composer__content {
    overflow: scroll;
    position: relative;
    flex: 1;
    margin-left: 1.8rem;
    margin-right: 1.8rem;
    background-color: $white;
    box-shadow: 0 .3rem 1rem rgba($black, 0.24), 0 .3rem 1rem rgba($black,
      0.16);
    @include transition(null, 0.3s);

    &__checkbox {
      &:checked {
        + .fc-preview__label {
          outline-color: $grey-l5;
        }

        ~ .fc-block__edit {
          display: block;
        }
      }
    }

    &__label {
      display: block;
      outline: 0.1rem dashed transparent;
      outline-offset: -0.1rem;
      @include transition(opacity, 0.2s);

      &:hover {
        outline-color: $grey-l5;
      }
    }

    &__save {
      position: fixed;
      right: 1.8rem;
      bottom: 2.8rem;
      z-index: 101;
      width: 4.5rem;
      height: 4.5rem;
      background-color: $accent;
      border-radius: percentage(1/2);
      color: $white;
      box-shadow: 0 .3rem 1rem rgba($black, 0.24), 0 .3rem 1rem rgba($black,
        0.16);
      @include transition(null, 0.3s);

      .fc-composer--aside & {
        right: $sidebar-size + 2.8rem;
      }
    }
  }
</style>
