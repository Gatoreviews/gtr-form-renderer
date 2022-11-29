<template>
  <v-autocomplete
    v-model="model"
    class="g-country"
    :items="filteredCountries"
    item-text="name"
    item-value="code"
    :label="field.label"
    :placeholder="field.placeholder"
    :hint="field.helper"
    :error-messages="errorMessages"
    persistent-hint
    outlined
    solo
    flat
    @input="onInput"
  >
    <template #selection="{ item }">
      <div class="g-country__selection">
        <img :src="item.src" width="24" />
        {{ item.name }}
      </div>
    </template>
    <template #item="{ item }">
      <div class="g-country__item">
        <img :src="item.src" width="24" />
        {{ item.name }}
      </div>
    </template>
  </v-autocomplete>
</template>

<script>
import { errorsMessages } from '@/mixins/errorsMessages.mixin'
import { countries } from '@/config/countries.config'
import { getCountryCode } from '@/services/form.service'

export default {
  name: 'GCountry',
  props: {
    field: {
      type: Object,
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
    countries,
  }),
  created() {
    this.model = this.field.defaultValue || null
    this.getUserCountryCode()
  },
  computed: {
    filteredCountries() {
      if (this.field.rules?.countries?.length > 0) {
        return countries.filter(country => this.field.rules.countries.includes(country.code))
      }
      return countries
    },
  },
  methods: {
    onInput() {
      this.$emit('input', {
        [this.field.slug]: this.model || null,
      })
    },
    async getUserCountryCode() {
      try {
        const response = await getCountryCode()
        if (response && response[0] === '1') this.model = response.substr(2, 2) || null
      } catch (err) {
        throw new Error(err)
      }
    },
  },
  destroyed() {
    this.model = null
    this.onInput()
  },
}
</script>

<style lang="scss" scoped>
.g-country {
  &__selection,
  &__item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
}
</style>
