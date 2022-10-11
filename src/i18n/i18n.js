import Vue from 'vue'
import Vuei18n from 'vue-i18n'
import fr from './languages/fr.json'
import en from './languages/en.json'

Vue.use(Vuei18n)

const i18n = new Vuei18n({
  locale: 'fr',
  fallbackLocale: 'fr',
  messages: {
    fr,
    en,
  },
  silentTranslationWarn: process.env.NODE_ENV === 'production',
})

export default i18n
