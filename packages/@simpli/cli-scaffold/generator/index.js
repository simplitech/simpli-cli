module.exports = (api, options) => {
  if (!options.sync) {
    api.render('./template')
  }

  const standardModels = options.scaffoldSetup.standardModels
  const requestModels = options.scaffoldSetup.requestModels
  const responseModels = options.scaffoldSetup.responseModels
  const resourceModels = options.scaffoldSetup.resourceModels
  const paginatedModels = options.scaffoldSetup.paginatedModels

  standardModels.forEach((resource) => {
    const data = { model: resource }

    api.renderFrom('./injected', 'src/model/Template.ts', `./${resource.name}.ts`, data)

    api.renderFrom('./injected', 'src/schema/InputTemplateSchema.ts', `./model/${resource.name}/Input${resource.name}Schema.ts`, data)
    api.renderFrom('./injected', 'src/schema/ListTemplateSchema.ts', `./model/${resource.name}/List${resource.name}Schema.ts`, data)
    api.renderFrom('./injected', 'src/schema/CsvTemplateSchema.ts', `./model/${resource.name}/Csv${resource.name}Schema.ts`, data)
  })

  requestModels.forEach((resource) => {
    const data = { model: resource }

    api.renderFrom('./injected', 'src/model/Template.ts', `./request/${resource.name}.ts`, data)

    api.renderFrom('./injected', 'src/schema/InputTemplateSchema.ts', `./request/${resource.name}/Input${resource.name}Schema.ts`, data)
  })

  responseModels.forEach((resource) => {
    const data = { model: resource }

    api.renderFrom('./injected', 'src/model/Template.ts', `./response/${resource.name}.ts`, data)

    api.renderFrom('./injected', 'src/schema/ListTemplateSchema.ts', `./response/${resource.name}/List${resource.name}Schema.ts`, data)
    api.renderFrom('./injected', 'src/schema/CsvTemplateSchema.ts', `./response/${resource.name}/Csv${resource.name}Schema.ts`, data)
  })

  resourceModels.forEach((resource) => {
    const collection = paginatedModels.find((paginatedModel) => resource.collectionName === paginatedModel.name) || null
    const data = { model: resource, collection }

    api.renderFrom('./injected', 'src/model/Template.ts', `./resource/${resource.name}.ts`, data)

    api.renderFrom('./injected', 'src/schema/InputTemplateSchema.ts', `./resource/${resource.name}/Input${resource.name}Schema.ts`, data)
    api.renderFrom('./injected', 'src/schema/ListTemplateSchema.ts', `./resource/${resource.name}/List${resource.name}Schema.ts`, data)
    api.renderFrom('./injected', 'src/schema/CsvTemplateSchema.ts', `./resource/${resource.name}/Csv${resource.name}Schema.ts`, data)

    if (collection) {
      api.renderFrom('./injected', 'src/views/list/ListTemplateView.vue', `List${resource.name}View.vue`, data)
      api.renderFrom('./injected', 'src/views/persist/PersistTemplateView.vue', `Persist${resource.name}View.vue`, data)
    }
  })

  paginatedModels.forEach((resource) => {
    const data = { model: resource }
    api.renderFrom('./injected', 'src/model/TemplateCollection.ts', `./collection/${resource.name}.ts`, data)
  })

  if (options.sync) return

  api.extendPackage({
    scripts: {
      'serve': 'vue-cli-service serve' + (
        // only auto open browser on MacOS where applescript
        // can avoid duplicate window opens
        process.platform === 'darwin'
          ? ' --open'
          : ''
      ),
      'beta': 'vue-cli-service build --mode beta',
      'staging': 'vue-cli-service build --mode staging',
      'build': 'vue-cli-service build',
      'lint': 'vue-cli-service lint',
      'test': 'vue-cli-service test:unit'
    },
    dependencies: {
      'font-awesome': '^4.7.0',
      'lodash': '^4.17.11',
      'moment': '^2.24.0',
      'normalize-scss': '^7.0.1',
      'pretty-checkbox': '^3.0.3',
      'register-service-worker': '^1.5.2',
      'simple-line-icons': '^2.4.1',
      'simpli-web-sdk': '^2.6.0',
      'tailwindcss-grid': '^1.2.1',
      'vue': '^2.6.10',
      'vue-class-component': '^7.1.0',
      'vue-meta': '^1.6.0',
      'vue-moment': '^4.0.0',
      'vue-property-decorator': '^8.1.0',
      'vue-spinner': '^1.0.3',
      'vuex': '^3.0.1',
      'vuex-class': '^0.3.1',
      'vuex-typescript': '^3.0.2'
    },
    devDependencies: {
      '@babel/plugin-proposal-nullish-coalescing-operator': '^7.4.4',
      '@babel/plugin-proposal-optional-chaining': '^7.6.0',
      '@fullhuman/postcss-purgecss': '^1.2.0',
      '@types/jest': '^24.0.11',
      '@vue/cli-plugin-babel': '^3.3.0',
      '@vue/cli-plugin-e2e-cypress': '^3.3.0',
      '@vue/cli-plugin-pwa': '^3.3.0',
      '@vue/cli-plugin-typescript': '^3.6.0',
      '@vue/cli-plugin-unit-jest': '^3.8.0',
      '@vue/cli-service': '^3.6.0',
      '@vue/test-utils': '^1.0.0-beta.20',
      'babel-core': '7.0.0-bridge.0',
      'jest': '^24.7.1',
      'lint-staged': '^8.1.0',
      'node-sass': '^4.11.0',
      'sass-loader': '^7.1.0',
      'tailwind-css-variables': '^2.0.2',
      'tailwindcss': '^1.0.4',
      'tailwindcss-transition': '^1.0.5',
      'ts-jest': '^24.0.2',
      'typescript': '^3.7.2',
      'vue-template-compiler': '^2.6.10'
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
