<template>
  <v-radio-group v-model="model" @change="onInput" :error-messages="errorMessages">
    <template #label>
      {{ field.label }}
    </template>
    <v-radio v-for="option in field.options" :key="option.value" :label="option.label" :value="option.value"></v-radio>
  </v-radio-group>
</template>

<script>
import { errorsMessages } from '@/mixins/errorsMessages.mixin'

export default {
  name: 'GRadio',
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
  destroyed() {
    this.model = null
    this.onInput()
  },
}
</script>
