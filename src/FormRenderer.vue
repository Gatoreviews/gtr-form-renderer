<template>
  <v-app>
    <v-main>
      <form id="form" class="form-renderer" novalidate autocomplete="off" @submit.prevent="onSubmit">
        <v-overlay v-if="loading" :value="loading" absolute>
          <v-progress-circular indeterminate :size="64" :width="6"></v-progress-circular>
        </v-overlay>
        <template v-else>
          <div class="form-renderer__title">
            {{ form.name }}
          </div>
          <div class="form-renderer__fields">
            <div v-for="field in form.fields" :key="field.slug" class="form-renderer__fields__item">
              <g-text-field
                v-if="textFieldTypes(field.type) && condition(field.condition)"
                :field="field"
                :v="$v"
                @input="saveField"
              />
              <g-date-picker
                v-if="field.type === 'datepicker' && condition(field.condition)"
                :field="field"
                :locale="locale"
                :v="$v"
                @input="saveField"
              />
              <g-select
                v-if="field.type === 'select' && condition(field.condition)"
                :field="field"
                :v="$v"
                @input="saveField"
              />
              <g-radio
                v-if="field.type === 'radio' && condition(field.condition)"
                :field="field"
                :v="$v"
                @input="saveField"
              />
              <g-checkbox
                v-if="field.type === 'checkbox' && condition(field.condition)"
                :field="field"
                :v="$v"
                @input="saveField"
              />
              <g-textarea
                v-if="field.type === 'textarea' && condition(field.condition)"
                :field="field"
                :v="$v"
                @input="saveField"
              />
            </div>
          </div>
          <div class="form-renderer__cta">
            <v-btn type="submit" rounded color="primary" :loadin="sending" :disabled="sending">{{ form.submit }}</v-btn>
          </div>
        </template>
      </form>
    </v-main>
  </v-app>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { getForm, postForm } from './services/form.service'
import { rules, operators } from './utils/rules.util'
import { removeNullFromObject } from './utils/object.util'
import GTextField from './components/GTextField.vue'
import GDatePicker from './components/GDatePicker.vue'
import GSelect from './components/GSelect.vue'
import GRadio from './components/GRadio.vue'
import GCheckbox from './components/GCheckbox.vue'
import GTextarea from './components/GTextarea.vue'
import GPhone from './components/GPhone.vue'

export default {
  components: {
    GTextField,
    GDatePicker,
    GSelect,
    GRadio,
    GCheckbox,
    GTextarea,
    GPhone,
  },
  name: 'FormRenderer',
  props: {
    formId: {
      type: String,
      required: true,
    },
    storeId: {
      type: [String, Number],
      required: false,
    },
    locale: {
      type: String,
      required: true,
    },
    devMode: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: () => ({
    loading: false,
    sending: false,
    form: null,
    image: null,
    fieldsValues: {},
    fieldsRules: null,
  }),
  mixins: [validationMixin],
  async created() {
    this.loading = true
    //Set currrent locale for Vuetify & i18n
    this.initLocale()
    //Get form by its UUID
    this.form = await getForm(this.formId, this.locale, this.devMode)
    //Generate default values on init
    this.initFieldsValues()
    //Generate all validation rules on init
    this.initFieldsRules()
    this.loading = false
  },
  methods: {
    initLocale() {
      this.$vuetify.lang.current = this.locale
      this.$i18n.locale = this.locale
    },
    initFieldsValues() {
      const filteredFields = this.getFilteredFields('defaultValue')
      filteredFields.forEach(field => {
        this.$set(this.fieldsValues, field.slug, field.defaultValue)
      })
    },
    initFieldsRules() {
      const filteredFields = this.getFilteredFields('rules')
      this.fieldsRules = rules(filteredFields)
    },
    getFilteredFields(key) {
      if (this.form && this.form.fields.length) {
        return this.form.fields.filter(field => field[key])
      }
      return []
    },
    saveField(field) {
      this.fieldsValues = {
        ...this.fieldsValues,
        ...field,
      }
      this.fieldsValues = removeNullFromObject(this.fieldsValues)
    },
    async onSubmit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.sending = true
        await this.$recaptchaLoaded()
        const token = await this.$recaptcha('leadSave')
        await postForm(this.formId, this.locale, this.fieldsValues, token, this.devMode)
        this.sending = false
      }
    },
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
  },
  validations() {
    return this.fieldsRules
  },
}
</script>

<style lang="scss">
.v-application .v-application--wrap {
  min-height: initial;
}
</style>

<style scoped lang="scss">
@import 'vuetify/dist/vuetify.min.css';
@import '@/styles/global.scss';
* {
  box-sizing: border-box;
}
.form-renderer {
  &__title {
    font-weight: bold;
    margin-bottom: 1rem;
    font-size: 1rem;
  }

  &__cta {
    display: flex;
    justify-content: center;
  }
}
</style>
