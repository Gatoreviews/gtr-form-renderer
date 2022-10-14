<template>
  <v-textarea
    v-model.trim="model"
    :label="field.label"
    :placeholder="field.placeholder"
    :type="field.type"
    :name="field.slug"
    :error-messages="errorMessages"
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
    v: {
      type: Object,
      required: false,
      default: () => {},
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
        [this.field.slug]: this.model || null,
      })
    },
  },
}
</script>
