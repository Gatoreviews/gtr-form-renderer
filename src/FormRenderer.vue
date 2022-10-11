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
                v-if="field.type === 'text' || field.type === 'email'"
                :field="field"
                :v="$v"
                @input="saveField"
              />

              <g-date-picker
                v-if="field.type === 'datepicker'"
                :field="field"
                :locale="locale"
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
import { rules } from './utils/rules.util'
import GTextField from './components/GTextField.vue'
import GDatePicker from './components/GDatePicker.vue'

export default {
  components: { GTextField, GDatePicker },
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
  },
  data: () => ({
    loading: false,
    sending: false,
    form: null,
    image: null,
    fieldsValues: null,
    fieldsRules: null,
  }),
  mixins: [validationMixin],
  async created() {
    this.loading = true
    //Set currrent locale for Vuetify & i18n
    this.initLocale()
    //Get form by its UUID
    this.form = await getForm(this.formId, this.locale)
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
        this.fieldsValues[field.slug] = field.defaultValue
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
    },
    async onSubmit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.sending = true
        await this.$recaptchaLoaded()
        const token = await this.$recaptcha('leadSave')
        await postForm(this.formId, this.locale, this.fieldsValues, token)
        this.sending = false
      }
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
