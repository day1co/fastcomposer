<template>
  <div class="preview-container">
    <main>
      <Container @drop="onDrop" :animation-duration="200">
        <Draggable v-for="(layer, layerIndex) in layers" :key="layerIndex">
          <layer-preview
            :key="'layer-' + layerIndex"
            :layer="layer"
          />
        </Draggable>
      </Container>
    </main>
    <button class="fc-composer__content__save" type="button" @click="save">
      <i class="material-icons">&#xE5CA;</i>
    </button>
  </div>
</template>

<script>
  import EventBus from './../../../event-bus/event-bus';
  import marked from 'marked';
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
      save() {
        const html = this.layers
          .map(
            block => `
            <section class="fc-block fc-layout fc-layout-${block.layout.id}">
              ${block.layout.templateFunc({
              $markdown: marked,
              ...block.values
            })}
            </section>`
          )
          .join('\n');
        EventBus.$emit('save', html);
      }
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
    background: -moz-linear-gradient(top,  rgba(135,224,253,1) 0%, rgba(83,203,241,1) 40%, rgba(5,171,224,1) 100%);
    background: -webkit-linear-gradient(top,  rgba(135,224,253,1) 0%,rgba(83,203,241,1) 40%,rgba(5,171,224,1) 100%);
    background: linear-gradient(to bottom,  rgba(135,224,253,1) 0%,rgba(83,203,241,1) 40%,rgba(5,171,224,1) 100%);
    box-shadow: 0 .3rem 1rem rgba($black, 0.24), 0 .3rem 1rem rgba($black,
      0.16);
    @include transition(null, 0.3s);

    .preview-container {
      background-color: $white;
    }

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
  .fc-block {
    position: relative;

    &__item {
    }

    &__edit {
      /*display: none;*/
      position: relative;
      margin: 0 1.8rem 1.2rem;
    }

    &__form {
      padding: 1.2rem 1.2rem;
      background-color: $dimmed;

      &__fieldset {
        padding: 1.8rem 1.8rem;
        border-radius: 0.5rem;
        background-color: $white;

        & + & {
          margin-top: 1rem;
        }
      }

      &__label {
        display: block;
        margin-bottom: 1rem;
        font-size: 1.2rem;
        border-bottom: 0.1rem solid $grey-l5;
      }

      &__name {
        display: inline-block;
        font-size: 1.4rem;
        text-transform: uppercase;
        margin-bottom: -0.1rem;
        border-bottom: 0.1rem solid $secondary;
      }

      &__input {
        box-sizing: border-box;
        display: block;
        border: 0 none;
        padding-left: 0.8rem;
        padding-right: 0.8rem;
        width: percentage(1);
        height: 4.2rem;
        font-size: 1.6rem;
        background-color: $blue-l2;
        border-radius: 0.5rem;
        color: $white;
        outline: 0 none;
        @include transition(null, 0.2s);

        &:focus {
          background-color: $accent;
          color: $white;
        }
      }
    }

    &__utils {
    }
  }
</style>
