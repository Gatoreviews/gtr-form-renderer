<template>
  <div>
    GTR Suite Form Builder
    <v-text-field label="Default Text Field" v-model="example"></v-text-field>
  </div>
</template>

<script>
import { VTextField } from 'vuetify/lib'
import { required } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'

export default {
  name: 'FormBuilder',
  components: {
    VTextField,
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    example: '',
  }),
  mixins: [validationMixin],
  validations() {
    return {
      example: {
        required,
      },
    }
  },
}
</script>
