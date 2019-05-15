<template>
  <div class="pane-form" :style="{width, height}">
    <header>
      <h3>{{title}}</h3>
    </header>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'pane',
    props: {
      title: {
        type: String,
        default: '',
      },
      width: {
        type: String,
        default: '100%',
      },
      height: {
        type: String,
        default: '100%',
      },
    },
  };
</script>


<style lang="scss" scoped>
  .pane-form {
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    overflow-y: scroll;
    header {
      display: flex;
      flex: 0 0 2rem;
      height: 2rem;

      h3 {
        flex: 1 1 0;
        margin: 0;
        padding: 0;
      }
    }
  }
</style>
