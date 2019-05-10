<template>
  <div class="fc-editor">
    <header>
      <h3>editor</h3>
      <button @click="save"><i class="fas fa-save"></i></button>
    </header>
    <main>
      <template v-for="block in blocks">
        <block-item
          :block="block"
          :key="block.id"
          :active="block === activeBlock"
          @select="selectBlock(block)"
          @remove="removeBlock(block)"
          @up="upBlock(block)"
          @down="downBlock(block)"
        ></block-item>
        <block-form v-if="block === activeBlock" :block="block" :key="block.id + '-form'"></block-form>
      </template>
    </main>
  </div>
</template>

<script>
import marked from 'marked';
import BlockItem from './block-item.vue';
import BlockForm from './block-form.vue';

export default {
  name: 'editor-pane',
  components: {
    BlockItem,
    BlockForm,
  },
  props: {
    blocks: Array,
  },
  data() {
    return {
      activeBlock: null,
      zoom: 100,
    };
  },
  methods: {
    selectBlock(block) {
      this.activeBlock = block;
      this.$emit('select', block);
    },
    addBlock(block) {
      this.blocks.push(block);
      this.selectBlock(block);
    },
    removeBlock(block) {
      const blockIndex = this.blocks.indexOf(block);
      if (blockIndex !== -1) {
        this.blocks.splice(blockIndex, 1);
        this.selectBlock(null);
      }
    },
    upBlock(block) {
      const blockIndex = this.blocks.indexOf(block);
      if (blockIndex > 0) {
        const tempBlock = this.blocks[blockIndex];
        // this.blocks[blockIndex] = this.blocks[blockIndex - 1];
        // this.blocks[blockIndex - 1] = tempBlock;
        this.$set(this.blocks, blockIndex, this.blocks[blockIndex - 1]);
        this.$set(this.blocks, blockIndex - 1, tempBlock);
      }
    },
    downBlock(block) {
      const blockIndex = this.blocks.indexOf(block);
      if (blockIndex !== -1 && blockIndex < this.blocks.length - 1) {
        const tempBlock = this.blocks[blockIndex];
        // this.blocks[blockIndex] = this.blocks[blockIndex + 1];
        // this.blocks[blockIndex + 1] = tempBlock;
        this.$set(this.blocks, blockIndex, this.blocks[blockIndex + 1]);
        this.$set(this.blocks, blockIndex + 1, tempBlock);
      }
    },
    save() {
      const html = this.blocks
        .map(
          block => `
<section class="fc-block fc-layout fc-layout-${block.layout.id}">
${block.layout.templateFunc({ $markdown: marked, ...block.values })}
</section>`
        )
        .join('\n');
      this.$emit('save', html);
    },
  },
};
</script>

<style lang="scss" scoped>
.fc-editor {
  flex: 0 0 20rem;
  width: 20rem;
  display: flex;
  flex-direction: column;

  > header {
    display: flex;
    flex: 0 0 2rem;
    height: 2rem;
    h3 {
      flex: 1 1 0;
      margin: 0;
      padding: 0;
    }
    button {
      flex: 0 0 2rem;
      width: 2rem;
      height: 2rem;
      text-align: center;
    }
  }

  > main {
    display: flex;
    flex-direction: column;
    flex: 1 1 0;
    overflow: scroll;
  }
}
</style>
