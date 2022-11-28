import { helpers } from 'vuelidate/lib/validators'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

export const minDate = min =>
  helpers.withParams({ type: 'minDate', min }, value => {
    if (Array.isArray(value)) {
      return !helpers.req(value[0]) || dayjs(value[0]).isSameOrAfter(min, 'day')
    }
    return !helpers.req(value) || dayjs(value).isSameOrAfter(min, 'day')
  })

export const maxDate = max =>
  helpers.withParams({ type: 'maxDate', max }, value => {
    if (Array.isArray(value)) {
      return !helpers.req(value[1]) || dayjs(value[1]).isSameOrBefore(max, 'day')
    }
    return !helpers.req(value) || dayjs(value).isSameOrBefore(max, 'day')
  })
