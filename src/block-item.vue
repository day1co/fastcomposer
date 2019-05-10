<template>
  <div class="fc-block-item" :class="{ active }">
    <button @click="$emit('select', block)">
      <img :src="block.layout.icon" alt="" />
      <p>{{ block.layout.id }}</p>
      <p>
        <small>{{ block.layout.description }}</small>
      </p>
    </button>
    <button v-if="block.hidden" @click="show">
      <i class="fas fa-eye-slash"></i>
    </button>
    <button v-if="!block.hidden" @click="hide">
      <i class="fas fa-eye"></i>
    </button>
    <button @click="$emit('remove', block)">
      <i class="fas fa-trash-alt"></i>
    </button>
    <button @click="$emit('up', block)">
      <i class="fas fa-arrow-up"></i>
    </button>
    <button @click="$emit('down', block)">
      <i class="fas fa-arrow-down"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'block-item',
  props: {
    block: Object,
    active: Boolean,
  },
  data() {
    return {
      baseUrl: process.env.BASE_URL,
    };
  },
  methods: {
    show() {
      console.log('show', this.block);
      this.$set(this.block, 'hidden', false);
    },
    hide() {
      console.log('hide', this.block);
      this.$set(this.block, 'hidden', true);
    },
  },
};
</script>

<style lang="scss" scoped>
.fc-block-item {
  flex: 0 0 auto;
  display: flex;
  flex-wrap: nowrap;

  button {
    flex: 0 0 2rem;
    text-align: center;
    border: none;
    padding: 0.25rem;
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
