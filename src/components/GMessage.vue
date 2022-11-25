<template>
  <div class="g-message">
    <!-- Template code 404 (form not found) -->
    <template v-if="message.code === 404">
      <v-icon color="error" size="96">{{ icons.mdiCancel }}</v-icon>
      <div class="g-message__title">
        {{ $t(`error.404.title`) }}
      </div>
      <div
        class="g-message__subtitle"
        v-html="
          $t(`error.404.subtitle`, {
            formId,
          })
        "
      ></div>
    </template>
    <!-- Template code 422 (form fields invalid) -->
    <template v-else-if="message.code === 422">
      <v-icon color="error" size="96">{{ icons.mdiAlertCircleOutline }}</v-icon>
      <div class="g-message__title">
        {{ $t(`error.422.title`) }}
      </div>
      <div class="g-message__subtitle">
        {{ $tc(`error.422.subtitle`, message.details.errors.length, { count: message.details.errors.length }) }}
      </div>
      <ul class="g-message__details text--secondary">
        <li v-for="err in errorsDetails(message.details.errors)" :key="err.slug" class="g-message__details__field">
          <v-icon>{{ icons.mdiArrowRightThin }}</v-icon>
          <div class="g-message__details__field__rules">
            <div v-for="(ruleValue, ruleKey) in err.rules" :key="ruleKey">
              <div
                v-html="
                  $t(`rule.${ruleKey}`, {
                    field: err.field.label,
                    rule: ruleValue,
                  })
                "
              />
            </div>
            <div v-if="err.unknownValues && err.unknownValues.length">
              <div
                v-html="
                  $tc(`rule.unkown`, err.unknownValues.length, {
                    field: err.field.label,
                    value: err.unknownValues,
                  })
                "
              />
            </div>
            <div
              class="g-message__details__field__rules__value"
              v-if="err.field.value && !err.rules.hasOwnProperty('invalidFile')"
            >
              <v-icon size="20">{{ icons.mdiArrowRightBoldOutline }}</v-icon>
              <span
                v-if="Array.isArray(err.field.value)"
                v-html="$tc('error.valueFilledIn', err.field.value.length, { value: err.field.value })"
              ></span>
              <span v-else v-html="$tc('error.valueFilledIn', 1, { value: err.field.value })"></span>
            </div>
          </div>
        </li>
      </ul>
    </template>
    <!-- Template code 200 (sent form with success) -->
    <template v-else-if="message.code === 200">
      <v-icon color="success" size="96">{{ icons.mdiCheckboxMarkedCircleOutline }}</v-icon>
      <div class="g-message__title">
        {{ message.details.title }}
      </div>
      <div class="g-message__subtitle">
        {{ message.details.message }}
      </div>
    </template>
    <!-- Template code 500 (other errors) -->
    <template v-else>
      <v-icon color="error" size="96">{{ icons.mdiAlertCircleOutline }}</v-icon>
      <div class="g-message__title">
        {{ $t(`error.500.title`) }}
      </div>
      <div class="g-message__subtitle">
        {{ $t(`error.500.subtitle`) }}
      </div>
    </template>
  </div>
</template>

<script>
import {
  mdiCancel,
  mdiAlertCircleOutline,
  mdiArrowRightThin,
  mdiArrowRightBoldOutline,
  mdiCheckboxMarkedCircleOutline,
} from '@mdi/js'
import { formatedDate } from '@/utils/date.util'

export default {
  name: 'GMessage',
  props: {
    message: {
      type: Object,
      required: true,
    },
    form: {
      type: Object,
      required: false,
      default: null,
    },
    fieldsValues: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  data: () => ({
    icons: {
      mdiCancel,
      mdiAlertCircleOutline,
      mdiArrowRightThin,
      mdiArrowRightBoldOutline,
      mdiCheckboxMarkedCircleOutline,
    },
  }),
  inject: ['formId', 'locale'],
  methods: {
    errorsDetails(errors) {
      const errorsDetails = errors.map(error => {
        const field = this.form.fields.find(field => {
          return field.slug === error.slug
        })
        return {
          ...error,
          field: {
            label: field.label,
            value: this.fieldsValues[error.slug],
          },
          rules: this.rulesValue(error.rules || [], field),
        }
      })
      return errorsDetails
    },
    rulesValue(rules, field) {
      const rulesObject = {}
      rules.forEach(rule => {
        rulesObject[rule] =
          field.type === 'datepicker' ? formatedDate(field.rules[rule], 'L', this.locale) : field.rules[rule]
      })
      return rulesObject
    },
  },
}
</script>

<style lang="scss" scoped>
.g-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &__title {
    margin-top: 1rem;
    font-size: 1.125rem;
    font-weight: bold;
    text-align: center;
  }

  &__subtitle {
    margin-top: 0.25rem;
    text-align: center;
  }

  &__details {
    list-style-type: none;
    padding: 0;
    margin-top: 0.5rem;

    &__field {
      display: flex;
      align-items: flex-start;
      margin-top: 0.5rem;

      &:first-child {
        margin-top: 0;
      }

      &__rules {
        &__value {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
      }
    }
  }
}
</style>
