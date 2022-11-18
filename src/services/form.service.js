import { sendGetRequest, sendPostRequest } from '@/services/api.service'

const API_HOST = devMode => (devMode ? 'https://api-p.gtrsuite.io' : 'https://api.gtrsuite.io')
const FORM_API_URL = devMode => `${API_HOST(devMode)}/forms/`
const LEADS_API_URL = devMode => `${API_HOST(devMode)}/leads/`
const FILE_API_URL = devMode => `${API_HOST(devMode)}/files/`

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

export const postFile = async (formId, file, recaptcha, devMode) => {
  await new Promise(resolve => setTimeout(resolve, 2000))
  return await sendPostRequest(`${FILE_API_URL(devMode)}`, file, {
    headers: { recaptcha, formId, 'Content-Type': 'multipart/form-data' },
  })
}

export const getCountryCode = async () => {
  return await sendGetRequest('https://ip2c.org/s')
}
