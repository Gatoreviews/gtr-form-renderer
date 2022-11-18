<template>
  <v-stepper v-model="currentStep" class="g-stepper" :elevation="0" alt-labels>
    <v-stepper-header class="g-stepper__header">
      <template v-for="(step, index) in steps">
        <v-stepper-step
          class="g-stepper__header__step"
          :key="`step-${index}`"
          :complete="currentStep > index + 1"
          :step="index + 1"
        >
          {{ step.title }}
        </v-stepper-step>

        <v-divider v-if="index < steps.length - 1" :key="index"></v-divider>
      </template>
    </v-stepper-header>

    <v-stepper-items class="g-stepper__items">
      <v-stepper-content
        v-for="(step, index) in steps"
        :key="`content-${index}`"
        class="g-stepper__items__content"
        :step="index + 1"
      >
        <slot name="step" :elements="step.elements"></slot>
        <div class="g-stepper__items__content__actions">
          <v-btn text rounded @click="currentStep--" v-if="index > 0"> {{ previousLabel }} </v-btn>
          <v-spacer />
          <v-btn v-if="index < steps.length - 1" color="primary" outlined rounded @click="nextStep">
            {{ nextLabel }}
          </v-btn>
          <v-btn
            v-if="index === steps.length - 1"
            color="primary"
            rounded
            type="submit"
            :loading="sending"
            :disabled="sending"
          >
            {{ submitLabel }}
          </v-btn>
        </div>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import { parseSteps } from '@/utils/object.util'

export default {
  name: 'GStepper',
  props: {
    steps: {
      type: Array,
      required: true,
    },
    nextLabel: {
      type: String,
      required: true,
    },
    previousLabel: {
      type: String,
      required: true,
    },
    submitLabel: {
      type: String,
      required: true,
    },
    v: {
      type: Object,
      required: false,
      default: () => {},
    },
    sending: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: () => ({
    currentStep: 1,
    stepsRules: null,
  }),
  created() {
    this.initStepsRules()
  },
  methods: {
    initStepsRules() {
      this.stepsRules = parseSteps(this.steps)
    },
    nextStep() {
      this.v.$touch()
      const isInvalid = this.stepsRules[this.currentStep - 1].some(field => this.v.fieldsValues[field]?.$invalid)
      if (!isInvalid) {
        this.currentStep++
        this.v.$reset()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.g-stepper {
  &__header {
    box-shadow: none;

    &__step {
      padding: 1.5rem 1rem;
    }
  }

  &__items {
    &__content {
      padding: 0 0 1rem 0;

      &__actions {
        display: flex;
        padding-bottom: 6px;
      }
    }
  }
}
</style>
