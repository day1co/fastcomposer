<template>
  <div>
    <div v-for="(layoutKit, index) in layoutKits" :key="layoutKit.id">
      <list-item
        :title="layoutKit.id"
        :description="layoutKit.description"
        :icon="layoutKit.icon"
        @onClick="$emit('select', layoutKit)"/>
    </div>
  </div>
</template>

<script>
  import ListItem from '../../list-item.vue';

  export default {
    name: 'sidebar-pane',
    components: {
      ListItem,
    },
    props: {
      layoutKits: {
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
