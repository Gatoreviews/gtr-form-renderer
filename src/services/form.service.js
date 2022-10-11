import { sendGetRequest, sendPostRequest } from '@/services/api.service'

const FORM_API_URL = 'https://gtr-node-api-p.osc-fr1.scalingo.io/forms/'
const LEADS_API_URL = 'https://gtr-node-api-p.osc-fr1.scalingo.io/leads/'

export const getForm = async (formId, locale) => {
  return await sendGetRequest(`${FORM_API_URL}${formId}`, {
    headers: { locale },
  })
}

export const postForm = async (formId, locale, fieldsValues, recaptcha) => {
  await sendPostRequest(
    `${LEADS_API_URL}`,
    {
      formId,
      locale,
      storeId: '1',
      fieldsValues,
    },
    {
      headers: { recaptcha },
    }
  )
}
