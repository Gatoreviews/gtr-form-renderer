import axios from 'axios'

const api = axios.create({
  baseUlr: '/',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const sendGetRequest = async (url, config = null) => {
  try {
    const { data } = await api.get(url, config)
    return data
  } catch ({ response }) {
    throw response
  }
}

export const sendPostRequest = async (url, content, config = null) => {
  try {
    const { data } = await api.post(url, content, config)
    return data
  } catch ({ response }) {
    throw response
  }
}
