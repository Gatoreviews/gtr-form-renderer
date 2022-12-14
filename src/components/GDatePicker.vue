<template>
  <v-menu v-model="menu" ref="menu" :close-on-content-click="false" :return-value.sync="model" max-width="290">
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="displayedDate"
        :label="field.label"
        :placeholder="field.placeholder"
        :name="field.name"
        :hint="field.helper"
        :error-messages="errorMessages"
        persistent-hint
        readonly
        v-bind="attrs"
        v-on="on"
        outlined
        solo
        flat
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="model"
      :range="field.multiple"
      scrollable
      :min="minDate"
      :max="maxDate"
      :first-day-of-week="1"
      @change="onInput"
    />
  </v-menu>
</template>

<script>
import { errorsMessages } from '@/mixins/errorsMessages.mixin'
import { formatedDate } from '@/utils/date.util'

export default {
  name: 'GDatePicker',
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
    menu: false,
    model: null,
  }),
  inject: ['locale'],
  created() {
    this.model = this.field.defaultValue || null
  },
  computed: {
    displayedDate() {
      if (this.model && Array.isArray(this.model) && this.field.multiple) {
        return `${formatedDate(this.model[0], 'L', this.locale)} - ${formatedDate(this.model[1], 'L', this.locale)}`
      } else if (this.model && !Array.isArray(this.model)) {
        return formatedDate(this.model, 'L', this.locale)
      }
      return ''
    },
    minDate() {
      return this.field.rules?.minDate ? this.field.rules.minDate : null
    },
    maxDate() {
      return this.field.rules?.maxDate ? this.field.rules.maxDate : null
    },
  },
  methods: {
    onInput() {
      this.$refs.menu?.save(this.model)
      this.$emit('input', {
        [this.field.slug]: this.model || null,
      })
    },
  },
  destroyed() {
    this.model = null
    this.onInput()
  },
}
</script>
