<template>
  <form class="fcc-edit" @submit.prevent>

    <edit-entry
      v-for="[name, param] in params"
      :key="name"
      :path="path.setChild(name)"
      :param="param"
      :layer="layer" />

  </form>
</template>

<script>

import Layer from '../../../page/layer'
import Path from '../../../page/path'
import EditEntry from './entry.vue'

export default {
  name: 'edit',
  components: {
    EditEntry
  },
  provide() {
    return { layer: this.layer }
  },
  props: {
    layer: {
      type: Layer,
      required: true
    },
    child: Path
  },
  computed: {
    params() {
      if(this.child)
        return this.layer?.layout?.getListParams(this.path.child)
      else
        return this.layer?.layout?.params
    },
    path() {
      return this.child ?? this.layer.path
    }
  }
}

</script>
