<template>
  <v-textarea
    v-model="model"
    :label="field.label"
    :placeholder="field.placeholder"
    :type="field.type"
    :name="field.slug"
    no-resize
    auto-grow
    outlined
    solo
    flat
  />
</template>

<script>
export default {
  name: 'GTextArea',
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
