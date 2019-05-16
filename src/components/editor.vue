<template>
 <pane :title="`editor`">
   <form class="fc-block-form" @submit="$emit('apply', block)">
     <fieldset v-for="param in layer.layout.params" :key="param.name">
       <label>
         {{ param.name }}
         <small>({{ param.type }})</small>
       </label>
       <template v-if="param.type === 'text'">
         <input type="text" :name="param.name" :placeholder="param.description" v-model="values[param.name]" />
       </template>
       <template v-if="param.type === 'textarea'">
        <textarea
          :name="param.name"
          :placeholder="param.description"
          v-model="values[param.name]"
          @keyup="resize">
        </textarea>
       </template>
       <template v-if="param.type === 'url'">
         <input type="url" :name="param.name" :placeholder="param.description" v-model="values[param.name]" />
       </template>
       <template v-if="param.type === 'number'">
         <input type="number" :name="param.name" :placeholder="param.description" v-model="values[param.name]" />
       </template>
       <template v-if="param.type === 'image'">
         <input type="url" :name="param.name" :placeholder="param.description" v-model="values[param.name]" />
         <file-upload :name="param.name" accept="image/*" @upload="upload"/>
       </template>
     </fieldset>
     <!--
     <button type="reset" @click="$emit('reset', block)">reset</button>
     <button type="submit">apply</button>
     -->
   </form>
 </pane>
</template>

<script>
  import debounce from 'lodash/debounce';
  import FileUpload from './file-upload.vue';
  import Pane from './pane.vue';


  export default {
    name: 'editor',
    components: {
      FileUpload,
      Pane
    },
    props: {
      layer: {
        type: Object,
        default(){
          return {}
        }
      },
    },
    data() {
      return {
        values: this.layer.values, // ref. for live-update
        // view: Object.assign({}, this.block.value) // clone for manual apply/reset
      };
    },
    methods: {
      resize: debounce(event => {
        event.target.style.height = 'auto';
        event.target.style.height = `${event.target.scrollHeight}px`;
      }, 100),
      upload(name, url) {
        this.values[name] = url;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .fc-block-form {
    /*flex: 1 1 0;*/
    width: 100%;

    fieldset {
      border: none;
      & + fieldset {
        margin-top: 0.5rem;
      }
      label {
        display: block;
      }
      input {
        display: block;
        width: 100%;
        height: 2em;
      }
      textarea {
        display: block;
        width: 100%;
        min-height: 5em;
        overflow: hidden;
      }
      label + input,
      label + textarea {
        margin-top: 0.25em;
      }
    }
  }
</style>
