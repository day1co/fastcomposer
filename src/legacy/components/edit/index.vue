<template>
  <form class="fc-edit" @submit.prevent>

    <edit-entry
      v-for="[name, param] in layer.layout.params"
      :key="name"
      :path="layer.path.override({
        [layer.path.index == null? 'child' : 'grandchild']: name
      })"
      :param="param"
      :value="layer.values[param.name]" />

  </form>
</template>

<script>

import Layer from '../../../page/layer'
import EditEntry from './entry.vue'

export default {
  name: 'edit',
  components: {
    EditEntry
  },
  props: {
    layer: Layer
  },
  methods: {
    update(key, value) {
      this.$set(this.mappedValue, key, value)
    }
  },
  computed: {
    params() {
      return this.layer?.layouts?.params?.entries() ?? []
    }
  }
}

</script>
