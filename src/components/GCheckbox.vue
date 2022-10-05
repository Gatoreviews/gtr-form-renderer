<template>
  <v-checkbox v-model="model" :label="label" />
</template>

<script>
export default {
  name: 'GCheckbox',
  props: {
    label: {
      type: String,
      required: false,
      default: 'Label',
    },
  },
  data: () => ({
    model: '',
  }),
}
</script>
