<template>
  <div class="g-field">
    <g-text-field
      v-if="textFieldTypes(formField(field.slug).type) && condition(formField(field.slug).condition)"
      :field="formField(field.slug)"
      :v="v"
      @input="saveField"
    />
    <g-date-picker
      v-if="formField(field.slug).type === 'datepicker' && condition(formField(field.slug).condition)"
      :field="formField(field.slug)"
      :v="v"
      @input="saveField"
    />
    <g-select
      v-if="formField(field.slug).type === 'select' && condition(formField(field.slug).condition)"
      :field="formField(field.slug)"
      :v="v"
      @input="saveField"
    />
    <g-radio
      v-if="formField(field.slug).type === 'radio' && condition(formField(field.slug).condition)"
      :field="formField(field.slug)"
      :v="v"
      @input="saveField"
    />
    <g-checkbox
      v-if="formField(field.slug).type === 'checkbox' && condition(formField(field.slug).condition)"
      :field="formField(field.slug)"
      :v="v"
      @input="saveField"
    />
    <g-textarea
      v-if="formField(field.slug).type === 'textarea' && condition(formField(field.slug).condition)"
      :field="formField(field.slug)"
      :v="v"
      @input="saveField"
    />
    <g-phone
      v-if="formField(field.slug).type === 'tel' && condition(formField(field.slug).condition)"
      :field="formField(field.slug)"
      :v="v"
      @input="saveField"
    />
    <g-file
      v-if="formField(field.slug).type === 'file' && condition(formField(field.slug).condition)"
      :field="formField(field.slug)"
      :v="v"
      @input="saveField"
    />
    <g-country
      v-if="formField(field.slug).type === 'country' && condition(formField(field.slug).condition)"
      :field="formField(field.slug)"
      :v="v"
      @input="saveField"
    />
    <g-zip-code
      v-if="formField(field.slug).type === 'zipcode' && condition(formField(field.slug).condition)"
      :field="formField(field.slug)"
      :v="v"
      @input="saveField"
    />
  </div>
</template>

<script>
import { operators } from '@/utils/rules.util'

import GTextField from '@/components/GTextField.vue'
import GDatePicker from '@/components/GDatePicker.vue'
import GSelect from '@/components/GSelect.vue'
import GRadio from '@/components/GRadio.vue'
import GCheckbox from '@/components/GCheckbox.vue'
import GTextarea from '@/components/GTextarea.vue'
import GPhone from '@/components/GPhone.vue'
import GFile from '@/components/GFile.vue'
import GCountry from '@/components/GCountry.vue'
import GZipCode from '@/components/GZipCode.vue'

export default {
  name: 'GField',
  components: {
    GTextField,
    GDatePicker,
    GSelect,
    GRadio,
    GCheckbox,
    GTextarea,
    GPhone,
    GFile,
    GCountry,
    GZipCode,
  },
  props: {
    field: {
      type: Object,
      required: true,
    },
    form: {
      type: Object,
      required: true,
    },
    fieldsValues: {
      type: Object,
      required: true,
    },
    v: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  methods: {
    textFieldTypes(type) {
      return ['text', 'email', 'url', 'number'].includes(type)
    },
    condition(condition) {
      if (condition) {
        return (
          operators[condition.operator] &&
          operators[condition.operator](this.fieldsValues[condition.field], condition.value)
        )
      }
      return true
    },
    formField(slug) {
      return this.form.fields.find(field => field.slug === slug)
    },
    saveField(field) {
      this.$emit('save', field)
    },
  },
}
</script>
