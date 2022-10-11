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
    @input="onInput"
  />
</template>

<script>
import { errorsMessages } from '@/mixins/errorsMessages.mixin'

export default {
  name: 'GTextArea',
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
