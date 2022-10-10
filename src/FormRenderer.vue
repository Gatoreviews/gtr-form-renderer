<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <form id="form" class="form-renderer" novalidate autocomplete="off" @submit.prevent="onSubmit">
          <v-overlay v-if="loading" :value="loading">
            <v-progress-circular indeterminate :size="64" :width="6"></v-progress-circular>
          </v-overlay>
          <template v-else>
            <div class="form-renderer__title">
              {{ form.name }}
            </div>
            <div class="form-renderer__fields">
              <div v-for="field in form.fields" :key="field.slug" class="form-renderer__fields__item">
                <g-text-field v-if="field.type === 'text'" :field="field" :v="$v" @input="saveField" />
              </div>

              <g-text-field
                v-show="false"
                :field="{
                  label: 'Textfield',
                  placeholder: 'Textfield Number',
                  defaultValue: 1337,
                  type: 'hidden',
                }"
                @input="saveField"
              />

              <g-text-field
                :field="{
                  label: 'Textfield',
                  placeholder: 'Textfield Number',
                  defaultValue: 1337,
                  type: 'number',
                }"
                @input="saveField"
              />

              <g-textarea
                :field="{
                  label: 'Textarea',
                  placeholder: 'Textarea placeholder',
                  defaultValue: 'Lorem ipsum',
                }"
                @input="saveField"
              />
              <g-select
                :field="{
                  label: 'Select',
                  placeholder: 'Choisir une option',
                  defaultValue: 'select-1',
                  options: [
                    { value: 'select-1', label: 'Option 1' },
                    { value: 'select-2', label: 'Option 2' },
                    { value: 'select-3', label: 'Option 3' },
                  ],
                }"
                @input="saveField"
              />

              <g-select
                :field="{
                  label: 'Select Multiple',
                  multiple: true,
                  placeholder: 'Choisir une ou plsuieurs options',
                  defaultValue: ['select-1', 'select-2'],
                  options: [
                    { value: 'select-1', label: 'Option 1' },
                    { value: 'select-2', label: 'Option 2' },
                    { value: 'select-3', label: 'Option 3' },
                  ],
                }"
                @input="saveField"
              />
              <g-date-picker
                :field="{ label: 'Date', defaultValue: '2022-10-07', placeholder: 'Choisir une date' }"
                :locale="locale"
                @change="saveField"
              />
              <g-date-picker
                :field="{
                  label: 'Date Range',
                  multiple: true,
                  defaultValue: ['2022-10-07', '2022-10-14'],
                  placeholder: 'Choisir une date de début et de fin',
                }"
                :locale="locale"
                @change="saveField"
              />
              <g-checkbox
                :field="{ label: 'Checkbox', defaultValue: true, slug: 'checkbox-simple' }"
                @change="saveField"
              />
              <g-checkbox
                :field="{
                  label: 'Checkbox Multiple',
                  defaultValue: ['checkbox-2', 'checkbox-3'],
                  options: [
                    { value: 'checkbox-1', label: 'Checkbox 1' },
                    { value: 'checkbox-2', label: 'Checkbox 2' },
                    { value: 'checkbox-3', label: 'Checkbox 3' },
                  ],
                  slug: 'checkbox-multiple',
                }"
                :defaul-value="true"
                @change="saveField"
              />
              <g-radio
                :field="{
                  label: 'Radio',
                  defaultValue: 'radio-1',
                  slug: 'radio',
                  options: [
                    { value: 'radio-1', label: 'Radio 1' },
                    { value: 'radio-2', label: 'Radio 2' },
                    { value: 'radio-3', label: 'Radio 3' },
                  ],
                }"
                @change="saveField"
              />
            </div>
            <div class="form-renderer__cta">
              <v-btn type="submit" rounded color="primary">{{ form.submit }}</v-btn>
            </div>
          </template>
        </form>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { sendGetRequest, sendPostRequest } from './services/api.service'
import GSelect from './components/GSelect.vue'
import GTextField from './components/GTextField.vue'
import GDatePicker from './components/GDatePicker.vue'
import GCheckbox from './components/GCheckbox.vue'
import GRadio from './components/GRadio.vue'
import GTextarea from './components/GTextarea.vue'

export default {
  components: { GTextField, GSelect, GDatePicker, GCheckbox, GRadio, GTextarea },
  name: 'FormRenderer',
  props: {
    formId: {
      type: String,
      required: true,
    },
    locale: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    loading: false,
    form: null,
    image: null,
    fieldsValues: {},
  }),
  mixins: [validationMixin],
  async created() {
    this.$vuetify.lang.current = this.locale
    this.loading = true
    this.form = await sendGetRequest(`https://gtr-node-api-p.osc-fr1.scalingo.io/forms/${this.formId}`, {
      headers: { locale: this.locale },
    })
    this.getDefaultValues()
    this.loading = false
  },
  methods: {
    getDefaultValues() {
      if (this.form && this.form.fields.length) {
        this.form.fields
          .filter(field => field.defaultValue)
          .forEach(field => {
            this.fieldsValues[field.slug] = field.defaultValue
          })
      }
    },
    saveField(field) {
      this.fieldsValues = {
        ...this.fieldsValues,
        ...field,
      }
    },
    async onSubmit() {
      this.$v.$touch()
      await this.$recaptchaLoaded()
      const token = await this.$recaptcha('leadSave')
      await sendPostRequest(
        `https://gtr-node-api-p.osc-fr1.scalingo.io/forms/${this.formId}`,
        { fieldsValues: this.fieldsValues },
        {
          headers: { locale: this.locale, recaptcha: token },
        }
      )
    },
  },
  validations() {
    return {
      fieldsValues: {
        'awesome-field': {
          required,
        },
      },
    }
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
* {
  box-sizing: border-box;
}
.form-renderer {
  &__title {
    font-weight: bold;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  &__cta {
    display: flex;
    justify-content: center;
  }
}
</style>
