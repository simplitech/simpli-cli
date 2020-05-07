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
    api.renderFrom('./injected', 'src/schema/ExportTemplateSchema.ts', `./model/${resource.name}/Export${resource.name}Schema.ts`, data)
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
    api.renderFrom('./injected', 'src/schema/ExportTemplateSchema.ts', `./response/${resource.name}/Export${resource.name}Schema.ts`, data)
  })

  resourceModels.forEach((resource) => {
    const collection = paginatedModels.find((paginatedModel) => resource.collectionName === paginatedModel.name)
    const data = { model: resource, collection }

    api.renderFrom('./injected', 'src/model/Template.ts', `./resource/${resource.name}.ts`, data)

    api.renderFrom('./injected', 'src/schema/InputTemplateSchema.ts', `./resource/${resource.name}/Input${resource.name}Schema.ts`, data)
    api.renderFrom('./injected', 'src/schema/ListTemplateSchema.ts', `./resource/${resource.name}/List${resource.name}Schema.ts`, data)
    api.renderFrom('./injected', 'src/schema/ExportTemplateSchema.ts', `./resource/${resource.name}/Export${resource.name}Schema.ts`, data)

    if (collection) {
      api.renderFrom('./injected', 'src/schema/FilterTemplateSchema.ts', `./resource/${resource.name}/Filter${resource.name}Schema.ts`, data)
      api.renderFrom('./injected', 'src/components/filters/FilterTemplate.vue', `Filter${resource.name}.vue`, data)
      api.renderFrom('./injected', 'src/views/list/ListTemplateView.vue', `List${resource.name}View.vue`, data)
      api.renderFrom('./injected', 'src/views/persist/PersistTemplateView.vue', `Persist${resource.name}View.vue`, data)
    }
  })

  paginatedModels.forEach((resource) => {
    const itemModel = options.scaffoldSetup.modelByCollectionName(resource.name)
    const data = { model: resource, itemModel }
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
      '@brazilian-utils/brazilian-utils': '^1.0.0-rc.4',
      '@fortawesome/fontawesome-free': '^5.11.2',
      '@simpli/meta-schema': '^1.0.2',
      '@simpli/resource-collection': '^1.0.9',
      '@simpli/serialized-request': '^1.0.5',
      '@simpli/vue-adap-table': '^1.0.3',
      '@simpli/vue-await': '^1.0.4',
      '@simpli/vue-input': '^1.0.4',
      '@simpli/vue-modal': '^1.0.4',
      '@simpli/vue-render-schema': '^1.0.1',
      '@simpli/vuex-typescript': '^1.0.0',
      '@types/lodash': '^4.14.149',
      '@types/papaparse': '^4.5.9',
      'axios': '^0.19.2',
      'class-transformer': '^0.2.0',
      'compressorjs': '^1.0.5',
      'core-js': '^3.3.2',
      'lodash': '^4.17.11',
      'cropperjs': '^1.5.1',
      'js-sha256': '^0.9.0',
      'moment': '^2.24.0',
      'normalize-scss': '^7.0.1',
      'papaparse': '^4.6.3',
      'pretty-checkbox': '^3.0.3',
      'reflect-metadata': '^0.1.13',
      'register-service-worker': '^1.6.2',
      'shortid': '^2.2.14',
      'simple-line-icons': '^2.4.1',
      'v-money': '^0.8.1',
      'vee-validate': '^2.2.15',
      'vue': '^2.6.10',
      'vue-class-component': '^7.1.0',
      'vue-i18n': '^7.6.0',
      'vue-meta': '^1.6.0',
      'vue-moment': '^4.0.0',
      'vue-multiselect': '^2.1.6',
      'vue-property-decorator': '^8.3.0',
      'vue-router': '^3.0.2',
      'vue-snotify': '^3.0.4',
      'vue-spinner': '^1.0.3',
      'vue-sweetalert2': '^3.0.3',
      'vue-the-mask': '^0.11.1',
      'vue-transition-expand': '0.0.5',
      'vue-upload-component': '^2.8.20',
      'vuex': '^3.0.1',
      'vuex-class': '^0.3.1',
      'xlsx': '^0.15.6',
      'qs': '^6.9.3'
    },
    devDependencies: {
      '@babel/plugin-proposal-nullish-coalescing-operator': '^7.4.4',
      '@babel/plugin-proposal-optional-chaining': '^7.6.0',
      '@fullhuman/postcss-purgecss': '^1.2.0',
      '@types/jest': '^24.0.11',
      '@types/qs': '^6.9.1',
      '@vue/cli-plugin-babel': '^4.0.0',
      '@vue/cli-plugin-eslint': '^4.0.0',
      '@vue/cli-plugin-pwa': '^4.0.0',
      '@vue/cli-plugin-router': '^4.0.0',
      '@vue/cli-plugin-typescript': '^4.0.0',
      '@vue/cli-plugin-unit-jest': '^4.0.0',
      '@vue/cli-plugin-vuex': '^4.0.0',
      '@vue/cli-service': '^4.2.3',
      '@vue/eslint-config-prettier': '^5.0.0',
      '@vue/eslint-config-typescript': '^4.0.0',
      '@vue/test-utils': '1.0.0-beta.29',
      'eslint': '^5.16.0',
      'eslint-plugin-prettier': '^3.1.1',
      'eslint-plugin-vue': '^5.0.0',
      'lint-staged': '^9.4.2',
      'prettier': '^1.18.2',
      'sass': '^1.19.0',
      'sass-loader': '^8.0.0',
      'tailwind-css-variables': '^2.0.2',
      'tailwindcss': '^1.0.4',
      'tailwindcss-transition': '^1.0.5',
      'typescript': '^3.7.2',
      'vue-template-compiler': '^2.6.10'
    },
    'gitHooks': {
      'pre-commit': 'lint-staged'
    },
    'lint-staged': {
      '*.{js,vue,ts}': [
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
