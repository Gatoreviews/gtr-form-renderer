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
import { errorsMessages } from '@/mixins/errorsMessages.mixin'

export default {
  name: 'GCheckbox',
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
    onChange() {
      this.$emit('input', {
        [this.field.slug]: this.model,
      })
    },
  },
}
</script>
