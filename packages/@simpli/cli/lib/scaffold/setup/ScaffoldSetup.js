const map = require('lodash.map')
const Model = require('./Model')
const ModelType = require('./ModelType')
const Api = require('./Api')
const Auth = require('./Auth')
const startCase = require('lodash.startCase')
const camelCase = require('lodash.camelcase')
const kebabCase = require('lodash.kebabcase')
const snakeCase = require('lodash.snakecase')

module.exports = class ScaffoldSetup {
  constructor () {
    this.appName = null
    this.swaggerUrl = null
    this.apiUrlDev = null
    this.apiUrlProd = null
    this.availableLanguages = null
    this.defaultLanguage = null
    this.defaultCurrency = null
    this.useAuth = null
    this.auth = new Auth()
    this.apis = []
    this.models = []
  }

  /**
   * Filter APIs in order to get non CRUD APIs
   * @returns Api[]
   */
  get simpleAPIs () {
    return this.apis.filter((api) => {
      let isResource = false
      this.resourceModels.forEach((model) => {
        const regex = new RegExp(`^\/\\w+\/(?:${model.name})(?:\/\{\\w+\})*$`, 'g')
        if ((api.endpoint || '').match(regex)) isResource = true
      })
      return !isResource
    })
  }

  get socketUrlDev () {
    const apiUrlDev = this.apiUrlDev || ''
    return apiUrlDev.replace(/^http[s]?:\/\/(\S+)\/api(\/?)$/g, 'ws:\/\/$1\/ws$2')
  }

  get socketUrlProd () {
    const apiUrlProd = this.apiUrlProd || ''
    return apiUrlProd.replace(/^http[s]?:\/\/(\S+)\/api(\/?)$/g, 'ws:\/\/$1\/ws$2')
  }

  get standardModels () {
    return this.modelsByType(ModelType.STANDARD)
  }
  get resourceModels () {
    return this.modelsByType(ModelType.RESOURCE)
  }
  get requestModels () {
    return this.modelsByType(ModelType.REQUEST)
  }
  get responseModels () {
    return this.modelsByType(ModelType.RESPONSE)
  }
  get paginatedModels () {
    return this.modelsByType(ModelType.PAGINATED)
  }

  get availableModels () {
    return [...this.standardModels, ...this.resourceModels, ...this.requestModels, ...this.responseModels, ...this.paginatedModels]
  }

  modelsByType (type) {
    return this.models.filter((model) => model.type === type)
  }

  modelByCollectionName (name) {
    return this.models.find((model) => model.collectionName === name)
  }

  startCase (prop) {
    return startCase(prop)
  }
  camelCase (prop) {
    return camelCase(prop)
  }
  kebabCase (prop) {
    return kebabCase(prop)
  }
  snakeUpperCase (prop) {
    return (snakeCase(prop) || '').toUpperCase()
  }

  injectSwagger (definition, path) {
    this.setApis(path)
    this.setModels(definition, path)
  }

  /**
   * Set APIs from swagger.json
   * @param path Paths of swagger.json
   */
  setApis (path = {}) {
    const apis = []
    // Normalize
    Object.keys(path).forEach((endpoint) => {
      const method = path[endpoint]
      Object.keys(method).forEach((name) => {
        const apiConfig = method[name]
        apiConfig.method = name
        apiConfig.endpoint = endpoint
        apis.push(new Api(apiConfig))
      })
    })
    this.apis = apis
  }

  /**
   * Set models from swagger.json
   * @param definition Definitions of swagger.json
   * @param path Paths of swagger.json
   */
  setModels (definition = {}, path = {}) {
    this.models = map(definition, (def, name) => new Model(name, def, path, this.apis)) || []

    this.models.forEach((model) => {
      this.paginatedModels.forEach((paginatedModel) => {
        const itemAttr = paginatedModel.attrs.find((attr) => attr.name === 'items')
        if (itemAttr && itemAttr.type === model.name) {
          model.collectionName = paginatedModel.name
        }
      })

      model.objectAtrrs.forEach((attr) => {
        const model = this.models.find((m) => m.name === attr.type)
        if (model) attr.isObjectResource = model.isResource
      })
    })
  }

  buildLocaleResource () {
    let result = ''

    this.resourceModels.forEach((model) => {
      result += `    "${model.name}": "${startCase(model.name)}",\n`
    })

    result = result.slice(0, -2) // remove last line and comma
    result += '\n'

    return result
  }

  buildLocaleSchema () {
    let result = ''

    this.standardModels.forEach((model) => {
      result += model.buildLocale('Input')
      result += model.buildLocale('List')
      result += model.buildLocale('Export')
    })

    this.requestModels.forEach((model) => {
      result += model.buildLocale('Input')
    })

    this.responseModels.forEach((model) => {
      result += model.buildLocale('Input')
      result += model.buildLocale('Export')
    })

    this.resourceModels.forEach((model) => {
      const collection = this.paginatedModels.find((paginatedModel) => model.collectionName === paginatedModel.name)

      result += model.buildFilterLocale('Filter', collection)
      result += model.buildLocale('Input')
      result += model.buildLocale('List')
      result += model.buildLocale('Export')
    })

    result = result.slice(0, -2) // remove last line and comma
    result += '\n'

    return result
  }
}
