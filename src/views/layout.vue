<template>
  <pane :title="`layout`" :width="width" :height="'50%'">
    <div v-for="layout in layouts" :key="layout.id">
      <list-item :title="layout.id"
                  :description="layout.description"
                  :icon="layout.icon"
                  @onClick="$emit('select', layout)"/>
    </div>
  </pane>
</template>

<script>
  import ListItem from '../components/list-item.vue';
  import Pane from '../components/pane.vue';

  export default {
    name: 'layout',
    components: {
      ListItem,
      Pane,
    },
    props: {
      layouts: {
        type: Array,
        default() {
          return [];
        },
      },
      width: {
        type: String,
        default: '100%',
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>
