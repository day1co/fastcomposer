<template>
  <div class="fc-list-item" :class="{ active }">
    <button @click="$emit('onClick')">
      <img :src="icon" alt=""/>
      <p>{{ title }}</p>
      <p>
        <small>{{ description }}</small>
      </p>
    </button>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'list-item',
    props: {
      title: {
        type: String,
        default: '',
      },
      description: {
        type: String,
        default: '',
      },
      icon: {
        type: String,
        default: '',
      },
      active: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>

<style lang="scss" scoped>
  .fc-list-item {
    flex: 0 0 auto;
    display: flex;
    flex-wrap: nowrap;


    button {
      flex: 0 0 2rem;
      text-align: center;
      border: none;
      padding: 0.25rem 0.25rem 0.25rem 0;
    }

    button:first-child {
      flex: 1 1 0;
      display: block;
      text-align: left;

      img {
        float: left;
        margin-right: 0.25rem;
        width: 50px;
        height: 50px;
      }
    }

    &.active button {
      background-color: darkgray;
    }
  }
</style>
