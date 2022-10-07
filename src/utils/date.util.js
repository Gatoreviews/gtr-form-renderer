import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(localizedFormat)
dayjs.extend(advancedFormat)
dayjs.extend(relativeTime)

/**
 * Returns the string of formated date, in the requested locale
 * @param {string} date date to parse
 * @param {string} locale locale to use for display
 * @returns {string} Parsed and formatted time
 */
export const formatedDate = (date, format, locale) => {
  require(`dayjs/locale/${locale}.js`)
  dayjs.locale(locale)

  return date === 'now' ? dayjs().format(format) : dayjs(date).format(format)
}
