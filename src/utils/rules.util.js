import { required, minLength, maxLength, minValue, maxValue, email, url, sameAs } from 'vuelidate/lib/validators'

export const rules = fields => {
  const rules = {
    fieldsValues: {},
  }

  fields.forEach(field => {
    Object.entries(field.rules).forEach(([key, value]) => {
      switch (key) {
        case 'required':
          if (field.type === 'checkbox' && !field.options) {
            rules.fieldsValues[field.slug] = {
              ...rules.fieldsValues[field.slug],
              sameAs: sameAs(() => {
                return field.rules.required
              }),
            }
          } else {
            rules.fieldsValues[field.slug] = {
              ...rules.fieldsValues[field.slug],
              required,
            }
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

export const operators = {
  exists: comparedValue => {
    return typeof comparedValue !== 'undefined'
  },
  equals: (comparedValue, value) => {
    return value == comparedValue
  },
  not_equals: (comparedValue, value) => {
    return value != comparedValue
  },
  contains: (comparedValue, value) => {
    return comparedValue && comparedValue.includes(value)
  },
  superior: (comparedValue, value) => {
    return value > comparedValue
  },
  superior_equals: (comparedValue, value) => {
    return value >= comparedValue
  },
  inferior: (comparedValue, value) => {
    return value < comparedValue
  },
  inferior_equals: (comparedValue, value) => {
    return value <= comparedValue
  },
  in: (comparedValue, value) => {
    return value.includes(comparedValue)
  },
  not_in: (comparedValue, value) => {
    return !value.includes(comparedValue)
  },
  all: (comparedValue, value) => {
    return value.every(val => comparedValue.includes(val))
  },
}
