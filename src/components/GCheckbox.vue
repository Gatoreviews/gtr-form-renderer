<template>
  <div v-if="field.options">
    <v-checkbox
      v-model="model"
      v-for="option in field.options"
      :key="option.value"
      :label="option.label"
      :value="option.value"
      hide-details
      @change="onChange"
    />
  </div>
  <div v-else>
    <v-checkbox v-model="model" :label="field.label" @change="onChange" />
  </div>
</template>

<script>
export default {
  name: 'GCheckbox',
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
