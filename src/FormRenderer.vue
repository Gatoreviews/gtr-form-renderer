<template>
  <v-app>
    GTR Suite Form Renderer
    <g-text-field />
    <g-select />
  </v-app>
</template>

<script>
import GSelect from './components/GSelect.vue'
import GTextField from './components/GTextField.vue'

export default {
  components: { GTextField, GSelect },
  name: 'FormRenderer',
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
}
</script>

<style lang="scss">
html,
body {
  overflow-x: hidden;
  overflow-y: auto;
}
</style>

<style scoped>
@import 'vuetify/dist/vuetify.min.css';
</style>
