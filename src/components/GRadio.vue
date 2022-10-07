<template>
  <v-radio-group v-model="model">
    <v-radio
      v-for="option in field.options"
      :key="option.key"
      :label="option.value"
      :value="option.key"
      @change="onChange"
    ></v-radio>
  </v-radio-group>
</template>

<script>
export default {
  name: 'GRadio',
  props: {
    field: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    model: null,
  }),
  created() {
    this.model = this.field.defaultValue || null
  },
  methods: {
    onChange() {
      this.$emit('change', {
        [this.field.slug]: this.model,
      })
    },
  },
}
</script>
