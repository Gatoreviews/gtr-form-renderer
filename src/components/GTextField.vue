<template>
  <v-text-field
    v-model="model"
    :label="field.label"
    :placeholder="field.placeholder"
    :type="field.type"
    :name="field.slug"
    :hint="field.helper"
    :error-messages="errorMessages"
    persistent-hint
    outlined
    solo
    flat
    @input="onInput"
  />
</template>

<script>
export default {
  name: 'GTextField',
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
  data: () => ({
    model: null,
  }),
  created() {
    this.model = this.field.defaultValue || null
  },
  computed: {
    errorMessages() {
      const errors = []
      if ((!this.v && !this.v) || !this.v.fieldsValues[this.field.slug].$dirty) return errors
      this.v.fieldsValues[this.field.slug].required === false && errors.push('Ce champ est requis')
      this.v.fieldsValues[this.field.slug].minLength === false &&
        errors.push(`${this.v.fieldsValues[this.field.slug].$params.minLength.min} caractères minimum`)
      return errors
    },
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
