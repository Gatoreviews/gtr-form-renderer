const { defineConfig } = require('@vue/cli-service')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

function enableShadowCss(config) {
  const configs = [config.module.rule('vue').use('vue-loader')]
  const ruleSets = ['css', 'postcss', 'scss', 'sass', 'less', 'stylus']
  const ruleNames = ['vue-modules', 'vue', 'normal-modules', 'normal']

  ruleSets.forEach(ruleSet => {
    if (config.module.rules.store.has(ruleSet)) {
      ruleNames.forEach(rName => {
        if (config.module.rule(ruleSet).oneOfs.store.has(rName)) {
          if (config.module.rule(ruleSet).oneOf(rName).uses.store.has('vue-style-loader')) {
            configs.push(config.module.rule(ruleSet).oneOf(rName).use('vue-style-loader'))
          }
        }
      })
    }
  })
  if (!process.env.BUILD_MODE) {
    process.env.BUILD_MODE = config.store.get('mode')
  }
  configs.forEach(c =>
    c.tap(options => {
      // eslint-disable-next-line no-param-reassign
      options.shadowMode = true
      return options
    })
  )
}

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    devtool: 'source-map',
    plugins: [new VuetifyLoaderPlugin()],
  },
  chainWebpack: config => {
    enableShadowCss(config)
  },
  css: {
    sourceMap: true,
    extract: false,
  },
})
