import { required, minLength, maxLength, minValue, maxValue, email, url, sameAs } from 'vuelidate/lib/validators'
import { phone } from '@/validators/phone.validator'
import { zipCode } from '@/validators/zipcode.validator'
import { minDate, maxDate } from '@/validators/date.validator'

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
        case 'minDate':
          rules.fieldsValues[field.slug] = {
            ...rules.fieldsValues[field.slug],
            minDate: minDate(value),
          }
          break
        case 'maxDate':
          rules.fieldsValues[field.slug] = {
            ...rules.fieldsValues[field.slug],
            maxDate: maxDate(value),
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
        case 'phone':
          rules.fieldsValues[field.slug] = {
            ...rules.fieldsValues[field.slug],
            phone,
          }
          break
        case 'zipcodeCountry':
          rules.fieldsValues[field.slug] = {
            ...rules.fieldsValues[field.slug],
            zipCode: zipCode(value),
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
    if (typeof comparedValue === 'string' && typeof value === 'string') {
      return value == comparedValue
    } else if (Array.isArray(comparedValue) && Array.isArray(value)) {
      const sortedComparedValue = [...comparedValue].sort()
      const sortedValue = [...value].sort()
      return JSON.stringify(sortedComparedValue) === JSON.stringify(sortedValue)
    }
    return false
  },
  not_equals: (comparedValue, value) => {
    return value != comparedValue
  },
  contains: (comparedValue, value) => {
    return comparedValue?.includes(value)
  },
  superior: (comparedValue, value) => {
    return comparedValue > value
  },
  superior_equals: (comparedValue, value) => {
    return comparedValue >= value
  },
  inferior: (comparedValue, value) => {
    return comparedValue < value
  },
  inferior_equals: (comparedValue, value) => {
    return comparedValue <= value
  },
  in: (comparedValue, value) => {
    if (Array.isArray(comparedValue) && Array.isArray(value)) {
      return comparedValue.every(val => value.includes(val))
    }
    return comparedValue && value.includes(comparedValue)
  },
  not_in: (comparedValue, value) => {
    return comparedValue && !value.includes(comparedValue)
  },
  all: (comparedValue, value) => {
    return comparedValue && value.every(val => comparedValue.includes(val))
  },
}
