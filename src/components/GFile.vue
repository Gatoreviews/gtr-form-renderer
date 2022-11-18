<template>
  <div class="g-file">
    <v-card flat class="g-file__zone" :disabled="uploading">
      <div
        class="g-file__zone__overlay"
        :class="{
          'g-file__zone__overlay--dragging': dragging,
          'g-file__zone__overlay--error': errorMessages.length,
          'g-file__zone__overlay--success': response?.statusCode === 201,
        }"
        @dragover.prevent="dragover"
        @dragleave.prevent="dragleave"
        @drop.prevent="drop"
        @click.stop="$refs.file.click()"
      ></div>
      <input type="file" @input="onChange" ref="file" :accept="inputFileFormats" class="g-file__zone__file" />
      <v-icon
        size="56"
        class="g-file__zone__icon"
        :class="{
          'g-file__zone__icon--dragging': dragging,
          'g-file__zone__icon--error': errorMessages.length,
          'g-file__zone__icon--success': response?.statusCode === 201,
        }"
      >
        <template v-if="response?.statusCode === 201">{{ icons.mdiCloudCheckVariantOutline }}</template>
        <template v-else-if="response?.statusCode === 400 || errorMessages.length">
          {{ icons.mdiCloudAlertOutline }}
        </template>
        <template v-else>{{ icons.mdiCloudUploadOutline }}</template>
      </v-icon>
      <div class="g-file__zone__title">
        {{ field.label }}
      </div>
      <div class="g-file__zone__caption">
        <span v-if="dragging">{{ $t('field.file.drop') }}</span>
        <span v-else-if="!file">{{ $t('field.file.chooseOrDrag') }}</span>
        <span v-else>{{ file.name }} ({{ formatBytes(file.size) }})</span>
      </div>
      <div class="g-file__zone__actions">
        <v-btn small text :disabled="!file || uploading" @click.stop="resetFile"> {{ $t('field.file.clear') }} </v-btn>
        <v-btn small color="primary" :disabled="!isValid || uploading" :loading="uploading" @click.stop="onUpload">
          {{ $t('field.file.upload') }}
        </v-btn>
      </div>
      <div class="g-file__zone__details" v-if="displayedFileFormats || maxFileSize">
        <div v-if="displayedFileFormats && displayedFileFormats.length">
          {{ $t('field.file.fileFormats', { formats: displayedFileFormats }) }}
        </div>
        <div v-if="maxFileSize">
          {{ $t('field.file.fileSize', { size: formatBytes(maxFileSize) }) }}
        </div>
      </div>
    </v-card>
    <v-input class="g-file__helper" :error-messages="errorMessages"> </v-input>
  </div>
</template>

<script>
import { mdiCloudUploadOutline, mdiCloudCheckVariantOutline, mdiCloudAlertOutline } from '@/config/icons.config'
import { postFile } from '@/services/form.service'
import { formatBytes } from '@/utils/file.util'

export default {
  name: 'GFile',
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
  data: () => ({
    model: null,
    dragging: false,
    uploading: false,
    response: null,
    file: null,
    icons: {
      mdiCloudUploadOutline,
      mdiCloudCheckVariantOutline,
      mdiCloudAlertOutline,
    },
    formatBytes,
  }),
  inject: ['formId', 'devMode'],
  computed: {
    errorMessages() {
      const errors = []
      if (this.file) {
        !this.fileValidation.format &&
          errors.push(
            this.$t('error.fileFormat', {
              format: this.fileExtension.toUpperCase(),
              allowedFormats: this.displayedFileFormats,
            })
          )
        !this.fileValidation.size &&
          errors.push(
            this.$t('error.fileSize', { size: formatBytes(this.fileSize), maxSize: formatBytes(this.maxFileSize) })
          )
        !this.fileValidation.notEmpty && errors.push(this.$t('error.fileEmpty'))
      }
      if (this.v.fieldsValues[this.field.slug]) {
        if (!this.v.fieldsValues[this.field.slug].$dirty) return errors
        this.v.fieldsValues[this.field.slug].required === false && errors.push(this.$t('error.fileNotUploaded'))
      }
      return errors
    },
    inputFileFormats() {
      if (this.field.rules?.fileExtensions?.length) {
        return this.field.rules.fileExtensions.map(ext => (ext !== '.' ? `.${ext}` : ext)).join(',')
      }
      return ['.']
    },
    displayedFileFormats() {
      return (
        this.response?.expectedExtensions?.map(ext => ext.toUpperCase()).join(', ') ||
        this.field.rules?.fileExtensions?.map(ext => ext.toUpperCase()).join(', ')
      )
    },
    supportedFileFormats() {
      return this.response?.expectedExtensions || this.field.rules?.fileExtensions || []
    },
    fileExtension() {
      return this.file?.name.split('.').pop().toLowerCase() || null
    },
    fileSize() {
      return this.file?.size || null
    },
    maxFileSize() {
      return this.response?.expectedSize || this.field.rules?.fileSize || null
    },
    fileValidation() {
      return {
        format: this.supportedFileFormats.length ? this.supportedFileFormats.includes(this.fileExtension) : true,
        size: this.maxFileSize ? this.fileSize <= this.maxFileSize : true,
        notEmpty: this.fileSize > 0,
      }
    },
    isValid() {
      return Object.values(this.fileValidation).every(el => el)
    },
  },
  methods: {
    dragover() {
      this.dragging = true
    },
    dragleave() {
      this.dragging = false
    },
    drop(e) {
      this.dragging = false
      if (e.dataTransfer?.files.length) {
        this.resetFile()
        this.file = e.dataTransfer.files[0]
        this.$refs.file.value = ''
      }
    },
    onChange(e) {
      if (e.target.files.length) {
        this.resetFile()
        this.file = e.target.files[0]
        this.$refs.file.value = ''
      }
    },
    resetFile() {
      this.file = null
      this.model = null
      this.response = null
      this.onInput()
    },
    async onUpload() {
      if (this.isValid) {
        this.uploading = true
        try {
          await this.$recaptchaLoaded()
          const token = await this.$recaptcha('fileUpload')
          let formData = new FormData()
          formData.append('file', this.file)
          const { id } = await postFile(this.formId, formData, token, this.devMode)
          this.model = id
          this.response = {
            statusCode: 201,
          }
          this.onInput()
        } catch (error) {
          this.response = error.data
        }
        this.uploading = false
      }
    },
    onInput() {
      this.$emit('input', {
        [this.field.slug]: this.model || null,
      })
    },
  },
  destroyed() {
    this.resetFile()
  },
}
</script>

<style lang="scss" scoped>
.g-file {
  &__zone {
    position: relative;
    display: flex;
    min-height: 12rem;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 1rem;

    &__overlay {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      cursor: pointer;
      border-radius: 0.25rem;
      border-width: 1px;
      border-style: dashed;
      border-color: rgba(0, 0, 0, 0.38);
      z-index: 1;

      .g-file__zone.theme--dark & {
        border-color: rgba(255, 255, 255, 0.24);
      }

      &--success {
        border-color: var(--v-success-base) !important;
      }

      &--error {
        border-color: var(--v-error-base) !important;
      }

      &--dragging {
        border-style: solid;
        border-color: var(--v-primary-base) !important;

        &:before {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          opacity: 0.1;
          background-color: var(--v-primary-base);
          content: '';
        }
      }
    }

    &__icon {
      margin-top: -0.5rem;

      &--error {
        color: var(--v-error-base) !important;
      }

      &--success {
        color: var(--v-success-base) !important;
      }

      &--dragging {
        color: var(--v-primary-base) !important;
      }
    }

    &__file {
      display: none;
    }

    &__title {
      font-weight: 600;
      font-size: 1.125rem;
    }

    &__caption {
      margin-top: 0.5rem;
      text-align: center;
    }

    &__actions {
      display: flex;
      position: static;
      margin-top: 1rem;
      margin-bottom: 1rem;
      gap: 1.5rem;
      z-index: 2;
    }

    &__details {
      font-size: 0.75rem;
      opacity: 0.6;
      text-align: center;
    }
  }

  &__helper {
    margin-bottom: 0.5rem;
  }
}
</style>
