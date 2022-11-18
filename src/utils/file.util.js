import i18n from '@/i18n/i18n'

export const formatBytes = (bytes, decimals = 2, locale = i18n.locale) => {
  if (bytes === 0) return locale === 'fr' ? '0 octet' : '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizesFR = ['octets', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo']
  const sizesAll = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${locale === 'fr' ? sizesFR[i] : sizesAll[i]}`
}
