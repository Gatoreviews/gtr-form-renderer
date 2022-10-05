<template>
  <v-select
    v-model="model"
    :items="options"
    :label="label"
    :placeholder="placeholder"
    :multiple="multiple"
    outlined
    solo
    flat
  />
</template>

<script>
export default {
  name: 'GTRSelect',
  props: {
    label: {
      type: String,
      required: false,
      default: 'Label',
    },
    placeholder: {
      type: String,
      required: false,
      default: 'Placeholder',
    },
    type: {
      type: String,
      required: false,
      default: 'text',
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false,
    },
    options: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data: () => ({
    model: '',
  }),
}
</script>
