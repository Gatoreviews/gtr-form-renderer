<template>
  <v-text-field
    v-model.trim="model"
    :label="field.label"
    :placeholder="field.placeholder"
    :type="field.type"
    :name="field.slug"
    :hint="field.helper"
    :error-messages="errorMessages"
    persistent-hint
    outlined
    solo
    flat
    @input="onInput"
  />
</template>

<script>
import { errorsMessages } from '@/mixins/errorsMessages.mixin'

export default {
  name: 'GZipCode',
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
    model: null,
  }),
  created() {
    this.model = this.field.defaultValue || null
  },
  methods: {
    onInput() {
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

<style lang="scss">
.g-phone {
  display: flex;
  position: relative;

  &__country {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    max-width: 124px;

    fieldset {
      border-right: 0 !important;
    }

    &__selection,
    &__item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
  }

  &__number {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;

    &.v-text-field--outlined {
      position: initial;
    }

    .v-text-field__details {
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }
}
</style>
