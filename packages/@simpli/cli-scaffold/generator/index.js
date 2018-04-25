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
    api.renderFrom('./dynamic', 'src/model/Template.ts', `./${resource.name}.ts`, data)
  })

  simpleRespModels.forEach((resource) => {
    const data = { model: resource }
    api.renderFrom('./dynamic', 'src/model/Template.ts', `./response/${resource.name}.ts`, data)
  })

  resourceModels.forEach((resource) => {
    const data = { model: resource }
    api.renderFrom('./dynamic', 'src/model/Template.ts', `./resource/${resource.name}.ts`, data)
    api.renderFrom('./dynamic', 'src/views/list/ListTemplateView.vue', `List${resource.name}View.vue`, data)
  })

  respResourceModels.forEach((resource) => {
    const origin = options.scaffoldSetup.findOriginModel(resource)
    const data = { model: resource, origin }
    api.renderFrom('./dynamic', 'src/model/Template.ts', `./resource/response/${resource.name}.ts`, data)
    if (origin) {
      api.renderFrom('./dynamic', 'src/views/persist/PersistTemplateView.vue', `Persist${origin.name}View.vue`, data)
    }
  })

  if (options.sync) return

  api.extendPackage({
    typings: 'types/index.d.ts',
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
      '@types/lodash': '4.14.104',
      '@types/papaparse': '4.1.33',
      'animate.css': '3.6.1',
      'chart.js': '2.7.2',
      'chartkick': '2.3.3',
      'class-transformer': '0.1.9',
      'class-validator': '0.8.1',
      'font-awesome': '4.7.0',
      'js-sha256': '0.9.0',
      'linelay': '1.1.0',
      'lodash': '4.17.5',
      'moment': '2.21.0',
      'normalize-scss': '7.0.1',
      'register-service-worker': '1.1.1',
      'simple-line-icons': '2.4.1',
      'simpli-ts-vue': '1.3.0',
      'vue': '2.5.16',
      'vue-chartjs': '3.2.1',
      'vue-chartkick': '0.2.1',
      'vue-class-component': '6.2.0',
      'vue-i18n': '7.6.0',
      'vue-meta': '1.4.4',
      'vue-moment': '3.2.0',
      'vue-multiselect': '2.0.8',
      'vue-property-decorator': '6.0.0',
      'vue-resource': '1.5.0',
      'vue-router': '3.0.1',
      'vue-snotify': '3.0.4',
      'vuex': '3.0.1',
      'vuex-class': '0.3.0'
    },
    devDependencies: {
      '@vue/cli-plugin-babel': '3.0.0-beta.7',
      '@vue/cli-plugin-pwa': '3.0.0-beta.7',
      '@vue/cli-plugin-typescript': '3.0.0-beta.7',
      '@vue/cli-service': '3.0.0-beta.7',
      'lint-staged': '7.0.0',
      'node-sass': '4.8.2',
      'sass-loader': '6.0.7',
      'vue-template-compiler': '2.5.16'
    },
    'browserslist': [
      '> 1%',
      'last 2 versions',
      'not ie <= 8'
    ],
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
