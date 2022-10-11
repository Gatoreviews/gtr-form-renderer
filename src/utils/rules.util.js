import { required, minLength, maxLength, minValue, maxValue, email, url } from 'vuelidate/lib/validators'

export const rules = fields => {
  const rules = {
    fieldsValues: {},
  }

  fields.forEach(field => {
    Object.entries(field.rules).forEach(([key, value]) => {
      switch (key) {
        case 'required':
          rules.fieldsValues[field.slug] = {
            ...rules.fieldsValues[field.slug],
            required,
          }
          break
        case 'minLength':
          rules.fieldsValues[field.slug] = {
            ...rules.fieldsValues[field.slug],
            minLength: minLength(value),
          }
          break
        case 'maxLength':
          rules.fieldsValues[field.slug] = {
            ...rules.fieldsValues[field.slug],
            maxLength: maxLength(value),
          }
          break
        case 'min':
          rules.fieldsValues[field.slug] = {
            ...rules.fieldsValues[field.slug],
            minValue: minValue(value),
          }
          break
        case 'max':
          rules.fieldsValues[field.slug] = {
            ...rules.fieldsValues[field.slug],
            maxValue: maxValue(value),
          }
          break
        case 'email':
          rules.fieldsValues[field.slug] = {
            ...rules.fieldsValues[field.slug],
            email,
          }
          break
        case 'url':
          rules.fieldsValues[field.slug] = {
            ...rules.fieldsValues[field.slug],
            url,
          }
          break
      }
    })
  })

  return rules
}
