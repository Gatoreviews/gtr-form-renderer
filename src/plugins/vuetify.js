import Vue from 'vue'
import Vuetify from 'vuetify'
import fr from 'vuetify/lib/locale/fr'
import en from 'vuetify/lib/locale/en'

Vue.use(Vuetify)

const opts = {
  lang: {
    locales: { fr, en },
  },
  icons: {
    iconfont: 'mdiSvg',
  },
}

export default new Vuetify(opts)
