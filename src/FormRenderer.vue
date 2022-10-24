<template>
  <v-app>
    <v-main>
      <form id="form" class="form-renderer" novalidate autocomplete="off" @submit.prevent="onSubmit">
        <v-overlay v-if="loading" :value="loading" absolute>
          <v-progress-circular indeterminate :size="64" :width="6"></v-progress-circular>
        </v-overlay>
        <template v-else>
          <!-- Render title only if the form have a name -->
          <div v-if="form.ui.name" class="form-renderer__title">
            {{ form.ui.name }}
          </div>
          <!-- Render grid if the form ui avec elements at root -->
          <g-grid v-if="form.ui.elements?.length > 0" :elements="form.ui.elements">
            <template #field="{ field }">
              <g-field
                :form="form"
                :field="field"
                :fields-values="fieldsValues"
                :locale="locale"
                :v="$v"
                @save="saveField"
              />
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
          >
            <template #step="{ elements }">
              <g-grid v-if="elements?.length > 0" :elements="elements">
                <template #field="{ field }">
                  <g-field
                    :form="form"
                    :field="field"
                    :fields-values="fieldsValues"
                    :locale="locale"
                    :v="$v"
                    @save="saveField"
                  />
                </template>
              </g-grid>
            </template>
          </g-stepper>
          <!-- Render submit button only if we don't have stepper -->
          <div v-if="!form.ui.stepper" class="form-renderer__cta">
            <v-btn type="submit" rounded color="primary" :loadin="sending" :disabled="sending">
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

export default {
  components: {
    GGrid,
    GStepper,
    GField,
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
        await this.$recaptchaLoaded()
        const token = await this.$recaptcha('leadSave')
        await postForm(this.formId, this.storeId, this.locale, this.fieldsValues, token, this.devMode)
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
  padding-bottom: 6px;

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
