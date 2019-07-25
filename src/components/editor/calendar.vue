<template>
  <div class="fc-calender">
    <input
      type="text"
      class="fc-editor__form__input"
      maxlength="16"
      @keypress="updateDate"
      :id="layer.id + '--' + param.type"
      :name="param.name"
      :placeholder="param.description"
      v-model="layer.values[param.name]"
    />
  </div>
</template>
<script>
  export default {
    methods: {
      updateDate($event) {
        const keyCode = $event.which;

        if (keyCode >= 48 && keyCode <= 57 || keyCode === 8 || keyCode === 32 || keyCode === 45 || keyCode === 58) {
          if (this.layer.values[this.param.name].length === 4 || this.layer.values[this.param.name].length === 7) {
            this.layer.values[this.param.name] += '-';
          } else if (this.layer.values[this.param.name].length === 10) {
            this.layer.values[this.param.name] += ' ';
          } else if (this.layer.values[this.param.name].length === 13) {
            this.layer.values[this.param.name] += ':';
          }
        } else {
          this.layer.values[this.param.name] = this.layer.values[this.param.name].slice(0, -1);
        }
      }
    },
    props: {
      param: {
        type: Object,
        default() {
          return { };
        }
      },
      layer: {
        default() {
          return { };
        }
      },
    }
  }
</script>
<style>

</style>
