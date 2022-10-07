<template>
  <v-select
    v-model="model"
    :items="field.options"
    item-text="value"
    item-value="key"
    :label="field.label"
    :placeholder="field.placeholder"
    :multiple="field.multiple"
    outlined
    solo
    flat
  />
</template>

<script>
export default {
  name: 'GSelect',
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
}
</script>
