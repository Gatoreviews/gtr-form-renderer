<template>
  <v-app>
    <v-main>
      <v-container>
        GTR Suite Form Renderer
        <g-text-field />
        <g-select />
        <g-date-picker />
        <g-checkbox
      /></v-container>
    </v-main>
  </v-app>
</template>

<script>
import GSelect from './components/GSelect.vue'
import GTextField from './components/GTextField.vue'
import GDatePicker from './components/GDatePicker.vue'
import GCheckbox from './components/GCheckbox.vue'

export default {
  components: { GTextField, GSelect, GDatePicker, GCheckbox },
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
.v-application .v-application--wrap {
  min-height: initial;
}
</style>

<style scoped>
@import 'vuetify/dist/vuetify.min.css';
* {
  box-sizing: border-box;
}
</style>
