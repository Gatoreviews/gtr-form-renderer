import FormBuilder from './components/FormBuilder.vue'

// Declare install function executed by Vue.use()
const install = function (app) {
  // Don't install more than once
  if (install.installed) return
  install.installed = true
  // Register components
  app.component('FormBuilder', FormBuilder)
}

// Create module definition for Vue.use()
const plugin = {
  install,
}

// Use automatically when global Vue instance detected
let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}
if (GlobalVue) {
  GlobalVue.use(plugin)
}

// Default export is library as a whole, registered via Vue.use()
export default plugin

// Allow component use individually
export { FormBuilder }
