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
                <g-text-field v-if="field.type === 'text'" :field="field" />
              </div>

              <g-text-field
                :field="{
                  label: 'Textfield',
                  placeholder: 'Textfield Number',
                  defaultValue: 1337,
                  type: 'number',
                }"
              />

              <g-textarea
                :field="{
                  label: 'Textarea',
                  placeholder: 'Textarea placeholder',
                  defaultValue: 'Lorem ipsum',
                }"
              />
              <g-select
                :field="{
                  label: 'Select',
                  placeholder: 'Choisir une option',
                  defaultValue: 'select-1',
                  options: [
                    { key: 'select-1', value: 'Option 1' },
                    { key: 'select-2', value: 'Option 2' },
                    { key: 'select-3', value: 'Option 3' },
                  ],
                }"
              />

              <g-select
                :field="{
                  label: 'Select Multiple',
                  multiple: true,
                  placeholder: 'Choisir une ou plsuieurs options',
                  defaultValue: ['select-1', 'select-2'],
                  options: [
                    { key: 'select-1', value: 'Option 1' },
                    { key: 'select-2', value: 'Option 2' },
                    { key: 'select-3', value: 'Option 3' },
                  ],
                }"
              />
              <g-date-picker
                :field="{ label: 'Date', defaultValue: '2022-10-07', placeholder: 'Choisir une date' }"
                :locale="locale"
              />
              <g-date-picker
                :field="{
                  label: 'Date Range',
                  multiple: true,
                  defaultValue: ['2022-10-07', '2022-10-14'],
                  placeholder: 'Choisir une date de début et de fin',
                }"
                :locale="locale"
              />
              <g-checkbox :field="{ label: 'Checkbox', defaultValue: true }" :defaul-value="true" />
              <g-checkbox
                :field="{
                  label: 'Checkbox Multiple',
                  defaultValue: ['checkbox-2', 'checkbox-3'],
                  options: [
                    { key: 'checkbox-1', value: 'Checkbox 1' },
                    { key: 'checkbox-2', value: 'Checkbox 2' },
                    { key: 'checkbox-3', value: 'Checkbox 3' },
                  ],
                }"
                :defaul-value="true"
              />
              <g-radio
                :field="{
                  label: 'Radio',
                  defaultValue: 'radio-1',
                  slug: 'radio',
                  options: [
                    { key: 'radio-1', value: 'Radio 1' },
                    { key: 'radio-2', value: 'Radio 2' },
                    { key: 'radio-3', value: 'Radio 3' },
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
  async created() {
    this.$vuetify.lang.current = this.locale
    this.loading = true
    this.form = await sendGetRequest(`https://gtr-node-api-p.osc-fr1.scalingo.io/forms/${this.formId}`, {
      headers: { locale: this.locale },
    })
    this.loading = false
  },
  methods: {
    saveField(field) {
      this.fieldsValues = {
        ...this.fieldsValues,
        ...field,
      }
    },
    async onSubmit() {
      await sendPostRequest(
        `https://gtr-node-api-p.osc-fr1.scalingo.io/forms/${this.formId}`,
        { fieldsValues: this.fieldsValues },
        {
          headers: { locale: this.locale },
        }
      )
    },
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
