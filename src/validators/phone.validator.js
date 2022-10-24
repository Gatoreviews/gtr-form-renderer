import { helpers } from 'vuelidate/lib/validators'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

export const phone = value => {
  if (value) {
    const phoneNumber = parsePhoneNumberFromString(value)
    if (!phoneNumber) return false
    return phoneNumber.isValid()
  }
  return !helpers.req(value)
}
