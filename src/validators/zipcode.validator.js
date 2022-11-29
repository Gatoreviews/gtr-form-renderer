import { helpers } from 'vuelidate/lib/validators'
import { postcodeValidator, postcodeValidatorExistsForCountry } from 'postcode-validator'

export const zipCode = countryCode =>
  helpers.withParams({ type: 'zipCode', code: countryCode }, value => {
    if (postcodeValidatorExistsForCountry(countryCode)) {
      return !helpers.req(value) || postcodeValidator(value, countryCode)
    }
    return !helpers.req(value)
  })
