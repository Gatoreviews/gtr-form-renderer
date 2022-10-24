<template>
  <div class="g-phone">
    <v-autocomplete
      v-model="countryCode"
      class="g-phone__country"
      :items="countries"
      item-text="name"
      item-value="code"
      :label="$t('field.phone.country.label')"
      :placeholder="$t('field.phone.country.placeholder')"
      :error="errorMessages.length > 0"
      outlined
      solo
      flat
      @change="onInput"
    >
      <template #selection="{ item }">
        <div class="g-phone__country__selection">
          <img :src="getFlagSrc(item.code)" max-width="24" v-if="getFlagSrc(item.code)" /> +{{ item.prefix }}
        </div>
      </template>
      <template #item="{ item }">
        <div class="g-phone__country__item">
          <img :src="getFlagSrc(item.code)" max-width="24" v-if="getFlagSrc(item.code)" /> {{ item.name }}
        </div>
      </template>
    </v-autocomplete>
    <v-text-field
      v-model.trim="model"
      class="g-phone__number"
      :label="field.label"
      :placeholder="field.placeholder"
      :type="field.type"
      :name="field.slug"
      :hint="field.helper"
      :error-messages="errorMessages"
      persistent-hint
      outlined
      solo
      flat
      @input="onInput"
    />
  </div>
</template>

<script>
import { parsePhoneNumberFromString, isSupportedCountry } from 'libphonenumber-js'
import { errorsMessages } from '@/mixins/errorsMessages.mixin'
import { countries } from '@/config/countries.config'
import { getCountryCode } from '@/services/form.service'

export default {
  name: 'GPhone',
  props: {
    field: {
      type: Object,
      required: true,
    },
    locale: {
      type: String,
      required: true,
    },
    v: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  mixins: [errorsMessages],
  data: () => ({
    model: null,
    countryCode: '',
    countries,
  }),
  created() {
    this.model = this.field.defaultValue || null
    this.getUserCountryCode()
  },
  methods: {
    onInput() {
      const phoneNumber = parsePhoneNumberFromString(this.model, this.countryCode)
      // phoneNumber is defined with 2+ caracters
      if (phoneNumber) {
        // If phone number is valid, model is set to national format
        if (phoneNumber.isValid()) this.model = phoneNumber.formatNational()
        this.$emit('input', {
          [this.field.slug]: phoneNumber.number || null,
        })
      } else {
        this.$emit('input', {
          [this.field.slug]: this.model || null,
        })
      }
    },
    getFlagSrc(countryCode) {
      try {
        return require(`@/assets/flags/${countryCode.toLowerCase()}.svg`)
      } catch {
        return null
      }
    },
    async getUserCountryCode() {
      try {
        const response = await getCountryCode()
        if (response && response[0] === '1') this.setCountryCode(response.substr(2, 2))
      } catch (err) {
        throw new Error(err)
      }
    },
    setCountryCode(locale) {
      const countryAvailable = isSupportedCountry(locale)
      if (countryAvailable && locale) {
        this.countryCode = countryAvailable ? locale : null
      }
    },
  },
  destroyed() {
    this.model = null
    this.onInput()
  },
}
</script>

<style lang="scss">
.g-phone {
  display: flex;
  position: relative;

  &__country {
    max-width: 120px;

    fieldset {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 0 !important;
    }

    &__selection,
    &__item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
  }

  &__number {
    &.v-text-field--outlined {
      position: initial;
    }

    .v-text-field__details {
      position: absolute;
      left: 0;
      bottom: 0;
    }

    fieldset {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}
</style>
