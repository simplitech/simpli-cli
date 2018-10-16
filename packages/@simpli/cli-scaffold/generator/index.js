module.exports = (api, options) => {
  if (!options.sync) {
    api.render('./template')
  }

  const simpleModels = options.scaffoldSetup.simpleModels
  const simpleRespModels = options.scaffoldSetup.simpleRespModels
  const resourceModels = options.scaffoldSetup.resourceModels
  const respResourceModels = options.scaffoldSetup.respResourceModels

  simpleModels.forEach((resource) => {
    const data = { model: resource }
    api.renderFrom('./injected', 'src/model/Template.ts', `./${resource.name}.ts`, data)
  })

  simpleRespModels.forEach((resource) => {
    const data = { model: resource }
    api.renderFrom('./injected', 'src/model/Template.ts', `./response/${resource.name}.ts`, data)
  })

  resourceModels.forEach((resource) => {
    const data = { model: resource }
    api.renderFrom('./injected', 'src/model/Template.ts', `./resource/${resource.name}.ts`, data)
    api.renderFrom('./injected', 'src/views/list/ListTemplateView.vue', `List${resource.name}View.vue`, data)
  })

  respResourceModels.forEach((resource) => {
    const origin = options.scaffoldSetup.findOriginModel(resource)
    const data = { model: resource, origin }
    api.renderFrom('./injected', 'src/model/Template.ts', `./resource/response/${resource.name}.ts`, data)
    if (origin) {
      api.renderFrom('./injected', 'src/views/persist/PersistTemplateView.vue', `Persist${origin.name}View.vue`, data)
    }
  })

  if (options.sync) return

  api.extendPackage({
    scripts: {
      'serve': 'vue-cli-service serve' + (
        // only auto open browser on MacOS where applescript
        // can avoid dupilcate window opens
        process.platform === 'darwin'
          ? ' --open'
          : ''
      ),
      'build': 'vue-cli-service build',
      'lint': 'vue-cli-service lint'
    },
    dependencies: {
      'chart.js': '2.7.2',
      'chartkick': '3.0.1',
      'font-awesome': '4.7.0',
      'linelay': '1.1.0',
      'normalize-scss': '7.0.1',
      'register-service-worker': '1.5.2',
      'simple-line-icons': '2.4.1',
      'simpli-web-sdk': '^0.1.11',
      'vue': '^2.5.17',
      'vue-chartjs': '3.4.0',
      'vue-chartkick': '0.5.0',
      'vue-meta': '1.5.5',
      'vue-moment': '4.0.0',
      'vue-multiselect': '2.0.8',
      'vue-property-decorator': '7.2.0',
      'vue-spinner': '1.0.3',
      'vuex': '3.0.1',
      'vuex-class': '0.3.1'
    },
    devDependencies: {
      '@babel/core': '^7.1.2',
      '@cypress/webpack-preprocessor': '^3.0.0',
      '@vue/cli-plugin-babel': '^3.0.5',
      '@vue/cli-plugin-pwa': '^3.0.5',
      '@vue/cli-plugin-typescript': '^3.0.5',
      '@vue/cli-service': '^3.0.5',
      'babel-core': '7.0.0-bridge.0',
      'lint-staged': '^7.2.2',
      'node-sass': '^4.9.0',
      'sass-loader': '^7.0.1',
      'typescript': '^3.0.0',
      'vue-template-compiler': '^2.5.17'
    },
    'gitHooks': {
      'pre-commit': 'lint-staged'
    },
    'lint-staged': {
      '*.ts': [
        'vue-cli-service lint',
        'git add'
      ],
      '*.vue': [
        'vue-cli-service lint',
        'git add'
      ]
    }
  })

  // additional tooling configurations
  if (options.configs) {
    api.extendPackage(options.configs)
  }
}
