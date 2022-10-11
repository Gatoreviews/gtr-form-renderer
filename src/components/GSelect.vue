<template>
  <v-select
    v-model="model"
    :items="field.options"
    item-text="label"
    item-value="value"
    :label="field.label"
    :placeholder="field.placeholder"
    :multiple="field.multiple"
    outlined
    solo
    flat
    @input="onInput"
  />
</template>

<script>
import { errorsMessages } from '@/mixins/errorsMessages.mixin'

export default {
  name: 'GSelect',
  props: {
    field: {
      type: Object,
      required: true,
    },
  },
  mixins: [errorsMessages],
  data: () => ({
    model: null,
  }),
  created() {
    this.model = this.field.defaultValue || null
  },
  methods: {
    onInput() {
      this.$emit('input', {
        [this.field.slug]: this.model,
      })
    },
  },
}
</script>
