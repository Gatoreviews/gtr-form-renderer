<template>
  <div v-if="field.options" class="v-input--radio-group--column v-input--radio-group">
    <legend class="v-label theme--light">{{ field.label }}</legend>
    <v-checkbox
      v-model="model"
      v-for="(option, i) in field.options"
      class="g-checkbox"
      multiple
      :key="option.value"
      :label="option.label"
      :value="option.value"
      :error-messages="errorMessages"
      :hide-details="i !== field.options.length - 1"
      @change="onInput"
    />
  </div>
  <div v-else>
    <v-checkbox
      v-model="model"
      class="g-checkbox"
      :label="field.label"
      :error-messages="errorMessages"
      @change="onInput"
    />
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

<style lang="scss" scoped>
.g-checkbox {
  margin-top: 0;
  padding-top: 0;
  margin-bottom: 0.5rem;
}
</style>
