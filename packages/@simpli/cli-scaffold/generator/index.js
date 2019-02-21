module.exports = (api, options) => {
  if (!options.sync) {
    api.render('./template')
  }

  const standardModels = options.scaffoldSetup.standardModels
  const requestModels = options.scaffoldSetup.requestModels
  const responseModels = options.scaffoldSetup.responseModels
  const resourceModels = options.scaffoldSetup.resourceModels

  standardModels.forEach((resource) => {
    const data = { model: resource }
    api.renderFrom('./injected', 'src/model/Template.ts', `./${resource.name}.ts`, data)
  })

  requestModels.forEach((resource) => {
    const data = { model: resource }
    api.renderFrom('./injected', 'src/model/Template.ts', `./request/${resource.name}.ts`, data)
  })

  responseModels.forEach((resource) => {
    const data = { model: resource }
    api.renderFrom('./injected', 'src/model/Template.ts', `./response/${resource.name}.ts`, data)
  })

  resourceModels.forEach((resource) => {
    const data = { model: resource }
    api.renderFrom('./injected', 'src/model/Template.ts', `./resource/${resource.name}.ts`, data)
    api.renderFrom('./injected', 'src/schema/Template.schema.ts', `./${resource.name}.schema.ts`, data)
    api.renderFrom('./injected', 'src/views/list/ListTemplateView.vue', `List${resource.name}View.vue`, data)
    api.renderFrom('./injected', 'src/views/persist/PersistTemplateView.vue', `Persist${resource.name}View.vue`, data)
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
      'lint': 'vue-cli-service lint',
      'test': 'vue-cli-service test:unit'
    },
    dependencies: {
      'chart.js': '^2.7.3',
      'chartkick': '^3.0.2',
      'font-awesome': '^4.7.0',
      'linelay': '^1.6.1',
      'moment': '^2.23.0',
      'normalize-scss': '^7.0.1',
      'register-service-worker': '^1.5.2',
      'simple-line-icons': '^2.4.1',
      'simpli-web-sdk': '^1.7.0',
      'vue': '^2.5.21',
      'vue-router': '^3.0.1',
      'vue-chartjs': '^3.4.0',
      'vue-chartkick': '^0.5.0',
      'vue-meta': '^1.5.8',
      'vue-moment': '^4.0.0',
      'vue-multiselect': '^2.1.3',
      'vue-class-component': '^6.0.0',
      'vue-property-decorator': '^7.3.0',
      'vue-spinner': '^1.0.3',
      'vuex': '^3.0.1',
      'vuex-class': '^0.3.1'
    },
    devDependencies: {
      '@types/jest': '^23.1.4',
      '@vue/cli-plugin-babel': '^3.3.0',
      '@vue/cli-plugin-e2e-cypress': '^3.3.0',
      '@vue/cli-plugin-pwa': '^3.3.0',
      '@vue/cli-plugin-typescript': '^3.3.0',
      '@vue/cli-plugin-unit-jest': '^3.3.0',
      '@vue/cli-service': '^3.3.0',
      '@vue/test-utils': '^1.0.0-beta.20',
      'babel-core': '7.0.0-bridge.0',
      'lint-staged': '^8.1.0',
      'node-sass': '^4.11.0',
      'sass-loader': '^7.1.0',
      'ts-jest': '^23.0.0',
      'typescript': '^3.0.0',
      'vue-template-compiler': '^2.5.21'
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
