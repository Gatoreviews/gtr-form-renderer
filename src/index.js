import Vue from 'vue'
import FormRenderer from './FormRenderer.vue'
import VueCustomElement from 'vue-custom-element'
import vuetify from './plugins/vuetify'

Vue.use(VueCustomElement)
FormRenderer.vuetify = vuetify

vuetify.framework.theme.checkOrCreateStyleElement = function () {
  return
}

Vue.customElement('gtr-form-renderer', FormRenderer, {
  shadow: true,
  beforeCreateVueInstance(root) {
    const rootNode = root.el.getRootNode()

    if (rootNode instanceof ShadowRoot) {
      // eslint-disable-next-line no-param-reassign
      root.shadowRoot = rootNode
      const { querySelector } = document
      document.querySelector = function (selector) {
        if (selector === '[data-app]') return rootNode.firstChild
        return querySelector.call(this, selector)
      }
    } else {
      // eslint-disable-next-line no-param-reassign
      root.shadowRoot = document.head
    }
    return root
  },
  shadowCss: vuetify.framework.theme.generatedStyles,
})
