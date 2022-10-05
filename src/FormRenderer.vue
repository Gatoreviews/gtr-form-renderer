<template>
  <v-app>
    GTR Suite Form Renderer
    <v-text-field label="Default Text Field" v-model="example"></v-text-field>
  </v-app>
</template>

<script>
export default {
  name: 'FormRenderer',
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
}
</script>

<style scoped>
@import 'vuetify/dist/vuetify.min.css';
</style>
