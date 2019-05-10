<template>
  <div class="fc-layout-item">
    <button @click="$emit('select', layout)">
      <img :src="layout.icon" alt="" />
      <p>{{ layout.id }}</p>
      <p>
        <small>{{ layout.description }}</small>
      </p>
    </button>
  </div>
</template>

<script>
export default {
  name: 'layout-item',
  props: {
    layout: Object,
  },
};
</script>

<style lang="scss" scoped>
.fc-layout-item {
  display: flex;
  min-height: 2rem;

  button {
    flex: 1 1 0;
    display: block;
    text-align: left;
    border: none;
    padding: 0.25rem;

    img {
      float: left;
      margin-right: 0.25rem;
      width: 50px;
      height: 50px;
    }
  }
}
</style>
