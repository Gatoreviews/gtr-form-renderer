export const errorsMessages = {
  computed: {
    errorMessages() {
      const errors = []
      if (this.v.fieldsValues[this.field.slug]) {
        if (!this.v.fieldsValues[this.field.slug].$dirty) return errors
        this.v.fieldsValues[this.field.slug].required === false && errors.push(this.$t('error.required'))
        this.v.fieldsValues[this.field.slug].sameAs === false && errors.push(this.$t('error.required'))
        this.v.fieldsValues[this.field.slug].minLength === false &&
          this.field.options &&
          this.field.options.length > 0 &&
          errors.push(
            this.$t('error.minLengthArray', { count: this.v.fieldsValues[this.field.slug].$params.minLength.min })
          )
        this.v.fieldsValues[this.field.slug].maxLength === false &&
          this.field.options &&
          this.field.options.length > 0 &&
          errors.push(
            this.$t('error.maxLengthArray', { count: this.v.fieldsValues[this.field.slug].$params.maxLength.max })
          )
        this.v.fieldsValues[this.field.slug].minLength === false &&
          errors.push(this.$t('error.minLength', { count: this.v.fieldsValues[this.field.slug].$params.minLength.min }))
        this.v.fieldsValues[this.field.slug].maxLength === false &&
          errors.push(this.$t('error.maxLength', { count: this.v.fieldsValues[this.field.slug].$params.maxLength.max }))
        this.v.fieldsValues[this.field.slug].minValue === false &&
          errors.push(this.$t('error.minValue', { value: this.v.fieldsValues[this.field.slug].$params.minValue.min }))
        this.v.fieldsValues[this.field.slug].maxValue === false &&
          errors.push(this.$t('error.maxValue', { value: this.v.fieldsValues[this.field.slug].$params.maxValue.max }))
        this.v.fieldsValues[this.field.slug].email === false && errors.push(this.$t('error.email'))
        this.v.fieldsValues[this.field.slug].url === false && errors.push(this.$t('error.url'))
        this.v.fieldsValues[this.field.slug].phone === false && errors.push(this.$t('error.phone'))
      }
      return errors
    },
  },
}