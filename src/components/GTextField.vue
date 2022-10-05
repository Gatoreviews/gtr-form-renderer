<template>
  <v-text-field v-model="model" :label="label" :placeholder="placeholder" :type="type" outlined solo flat />
</template>

<script>
export default {
  name: 'GTRTextField',
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
  },
  data: () => ({
    model: '',
  }),
}
</script>
