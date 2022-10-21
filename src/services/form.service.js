import { sendGetRequest, sendPostRequest } from '@/services/api.service'

const FORM_API_URL = devMode => (devMode ? 'https://api-p.gtrsuite.io/forms/' : 'https://api.gtrsuite.io/forms/')
const LEADS_API_URL = devMode => (devMode ? 'https://api-p.gtrsuite.io/leads/' : 'https://api.gtrsuite.io/leads/')

export const getForm = async (formId, locale, devMode) => {
  return await sendGetRequest(`${FORM_API_URL(devMode)}${formId}`, {
    headers: { locale },
  })
}

export const postForm = async (formId, storeId, locale, fieldsValues, recaptcha, devMode) => {
  await sendPostRequest(
    `${LEADS_API_URL(devMode)}`,
    {
      formId,
      storeId,
      locale,
      fieldsValues,
    },
    {
      headers: { recaptcha },
    }
  )
}

export const getCountryCode = async () => {
  return await sendGetRequest('https://ip2c.org/s')
}
