<template>
  <div class="fc-preview">
    <div class="fc-preview__container">
      <layer-content
        v-for="(layer, layerIndex) in layers"
        :isSelected="layerIndex === index"
        :key="'layer-' + layerIndex"
        :layer="layer"
        :index="layerIndex"
      />

    </div>
    <button class="fc-preview__save" type="button" @click="save">
      <i class="material-icons">&#xE5CA;</i>
    </button>
  </div>
</template>

<script>
  import EventBus from './../../../event-bus/event-bus';
  import marked from 'marked';
  import LayerContent from './layer-content.vue';

  export default {
    components: {
      LayerContent,
    },
    props: {
      layers: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    data() {
      return {
        index: null
      }
    },
    computed: {
      html() {
        return this.layers
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
      }
    },
    methods: {
      save() {
        console.log(this.html);
        EventBus.$emit('save');
      }
    },
    mounted() {
      EventBus.$on('selected-layer', (index) => {
        this.index = index;
      });
      EventBus.$on('remove-layer', () => {
        this.index = null;
      })
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../../assets/scss/utils/utilities.scss';
  .fc-preview {
    background-color: $white;

    &__save {
      position: fixed;
      right: 1.75rem;
      top: .75rem;
      z-index: 101;
      width: 4.5rem;
      height: 4.5rem;
      background-color: $accent;
      border-radius: percentage(1/2);
      color: $white;
      box-shadow: 0 .3rem 1rem rgba($black, 0.24), 0 .3rem 1rem rgba($black,
        0.16);
      @include transition(null, 0.3s);

      .fc-composer--aside-r & {
        right: $sidebar-size + 1.75rem;
      }
    }

  }
</style>
