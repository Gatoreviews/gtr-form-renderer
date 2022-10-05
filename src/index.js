import Vue from 'vue'
import FormRenderer from './FormRenderer.vue'
import VueCustomElement from 'vue-custom-element'
import vuetify from './plugins/vuetify'

Vue.use(VueCustomElement)
FormRenderer.vuetify = vuetify
Vue.customElement('gtr-form-renderer', FormRenderer, {
  shadow: true,
  beforeCreateVueInstance(root) {
    const rootNode = root.el.getRootNode()

    if (rootNode instanceof ShadowRoot) {
      // eslint-disable-next-line no-param-reassign
      root.shadowRoot = rootNode
    } else {
      // eslint-disable-next-line no-param-reassign
      root.shadowRoot = document.head
    }
    return root
  },
})
