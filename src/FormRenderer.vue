<template>
  <v-app
    :style="{
      '--v-primary-base': color,
      '--v-accent-base': color,
      '--v-error-base': '#ff5252',
      '--v-success-base': '#4caf50',
      fontFamily: `${font}, Arial, sans-serif`,
    }"
  >
    <v-main>
      <form id="form" class="form-renderer" novalidate autocomplete="off" @submit.prevent="onSubmit">
        <div v-if="loading" class="form-renderer__loader">
          <div class="form-renderer__loader__title">{{ $t('form.loader.title') }}</div>
          <v-progress-linear color="primary" indeterminate rounded height="8"></v-progress-linear>
        </div>
        <g-message v-else-if="message.enabled" :message="message" :form="form" :fields-values="sentValues" />
        <template v-else>
          <!-- Render title only if the form have a name -->
          <div v-if="form.ui.name" class="form-renderer__title">
            {{ form.ui.name }}
          </div>
          <!-- Render grid if the form ui avec elements at root -->
          <g-grid v-if="form.ui.elements?.length > 0" :elements="form.ui.elements">
            <template #field="{ field }">
              <g-field :form="form" :field="field" :fields-values="fieldsValues" :v="$v" @save="saveField" />
            </template>
          </g-grid>
          <!-- Render stepper if the form ui avec stepper at root -->
          <g-stepper
            v-if="form.ui.stepper?.steps.length > 0"
            :steps="form.ui.stepper.steps"
            :next-label="form.ui.stepper.next"
            :previous-label="form.ui.stepper.previous"
            :submit-label="form.ui.submit"
            :v="$v"
            :sending="sending"
          >
            <template #step="{ elements }">
              <g-grid v-if="elements?.length > 0" :elements="elements">
                <template #field="{ field }">
                  <g-field :form="form" :field="field" :fields-values="fieldsValues" :v="$v" @save="saveField" />
                </template>
              </g-grid>
            </template>
          </g-stepper>
          <!-- Render submit button only if we don't have stepper -->
          <div v-if="!form.ui.stepper" class="form-renderer__cta">
            <v-btn type="submit" rounded color="primary" :loading="sending" :disabled="sending">
              {{ form.ui.submit }}
            </v-btn>
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
import { removeNullFromObject } from './utils/object.util'
import GGrid from './components/GGrid.vue'
import GStepper from './components/GStepper.vue'
import GField from './components/GField.vue'
import GMessage from './components/GMessage.vue'

export default {
  components: {
    GGrid,
    GStepper,
    GField,
    GMessage,
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
    color: {
      type: String,
      required: false,
      default: '#449afd',
    },
    dark: {
      type: Boolean,
      required: false,
      default: false,
    },
    font: {
      type: String,
      required: false,
      default: 'Poppins',
    },
  },
  data: () => ({
    loading: false,
    sending: false,
    message: {
      enabled: false,
      code: 0,
      details: null,
    },
    form: null,
    image: null,
    fieldsValues: {},
    fieldsRules: null,
    sentValues: null,
  }),
  mixins: [validationMixin],
  provide() {
    return {
      formId: this.formId,
      devMode: this.devMode,
      locale: this.locale,
    }
  },
  async created() {
    this.loading = true
    //Set currrent locale for Vuetify & i18n
    this.initLocale()
    //Set form customization
    this.initCustomization()
    try {
      //Get form by its UUID
      this.form = await getForm(this.formId, this.locale, this.devMode)
      //Generate default values on init
      this.initFieldsValues()
      //Generate all validation rules on init
      this.initFieldsRules()
    } catch (error) {
      this.$set(this.message, 'enabled', true)
      this.$set(this.message, 'code', error.status)
    }
    this.loading = false
  },
  methods: {
    initLocale() {
      //Set vuetify locale
      this.$vuetify.lang.current = this.locale
      //Set i18n locale
      this.$i18n.locale = this.locale
    },
    initCustomization() {
      //Set vuetify dark theme
      this.$vuetify.theme.dark = this.dark

      //Get Google Font
      let link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = `https://fonts.googleapis.com/css2?family=${this.font}:wght@400;500;600;700&display=swap`
      document.head.appendChild(link)
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
      if (this.form?.fields.length) {
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
        this.sentValues = JSON.parse(JSON.stringify(this.fieldsValues))
        try {
          await this.$recaptchaLoaded()
          const token = await this.$recaptcha('leadSave')
          await postForm(this.formId, this.storeId, this.locale, this.fieldsValues, token, this.devMode)
          this.$set(this.message, 'enabled', true)
          this.$set(this.message, 'code', 200)
          this.$set(this.message, 'details', {
            title: this.form.ui.success.title,
            message: this.form.ui.success.message,
          })
        } catch (error) {
          this.$set(this.message, 'enabled', true)
          this.$set(this.message, 'code', error.status)
          this.$set(this.message, 'details', error.data)
        }
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
@import '@/styles/global.scss';

.v-application .v-application--wrap {
  min-height: initial;
}
</style>

<style scoped lang="scss">
@import 'vuetify/dist/vuetify.min.css';
* {
  box-sizing: border-box;
}
.form-renderer {
  overflow-x: hidden;
  padding-top: 8px;
  padding-bottom: 8px;

  &__loader {
    display: flex;
    flex-direction: column;
    width: 250px;
    margin: 0 auto;
    align-items: center;

    &__title {
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
  }

  &__title {
    font-weight: bold;
    margin-bottom: 1rem;
    font-size: 1.125rem;
  }

  &__cta {
    display: flex;
    justify-content: center;
  }
}
</style>
