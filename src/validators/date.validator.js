import { helpers } from 'vuelidate/lib/validators'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

export const minDate = min =>
  helpers.withParams({ type: 'minDate', min }, value => !helpers.req(value) || dayjs(value).isSameOrAfter(min, 'day'))

export const maxDate = max =>
  helpers.withParams({ type: 'maxDate', max }, value => !helpers.req(value) || dayjs(value).isSameOrBefore(max, 'day'))
