const map = require('lodash.map')
const Model = require('./Model')
const Api = require('./Api')
const Dependence = require('./Dependence')
const camelCase = require('lodash.camelcase')
const kebabCase = require('lodash.kebabcase')
const snakeCase = require('lodash.snakecase')

module.exports = class ScaffoldSetup {
  constructor () {
    this.appName = null
    this.swaggerUrl = null
    this.apiUrlDev = null
    this.apiUrlProd = null
    this.userModel = null
    this.loginHolderModel = null
    this.loginRespModel = null
    this.availableLanguages = null
    this.defaultLanguage = null
    this.defaultCurrency = null
    this.apis = []
    this.models = []
  }

  // Remove CRUD APIs
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

  /**
   * Filter simple models: 000
   */
  get simpleModels () {
    return this.models.filter((resource) =>
      !resource.isResource &&
      !resource.isResp &&
      !resource.isPagedResp
    )
  }

  /**
   * Filter simple resp models: 010
   */
  get simpleRespModels () {
    return this.models.filter((resource) =>
      !resource.isResource &&
      resource.isResp &&
      !resource.isPagedResp
    )
  }

  /**
   * Filter resource models: 100
   */
  get resourceModels () {
    return this.models.filter((resource) =>
      resource.isResource &&
      !resource.isResp &&
      !resource.isPagedResp
    )
  }

  /**
   * Filter resp resource models: 110
   */
  get respResourceModels () {
    return this.models.filter((resource) =>
      resource.isResource &&
      resource.isResp &&
      !resource.isPagedResp
    )
  }

  /**
   * Filter paged resp resource models: 101
   */
  get pagedRespResourceModels () {
    return this.models.filter((resource) =>
      resource.isResource &&
      !resource.isResp &&
      resource.isPagedResp
    )
  }

  /**
   * Filter simple and resource models: 000 & 100
   */
  get exceptRespModels () {
    return this.models.filter((resource) =>
      !resource.isResp &&
      !resource.isPagedResp
    )
  }

  /**
   * Filter all except paged resp models
   */
  get exceptPagedRespModels () {
    return this.models.filter((resource) =>
      !resource.isPagedResp
    )
  }

  /**
   * Get origin model
   */
  findOriginModel (target = new Model()) {
    if (!target.isResp) return null
    return this.models.find((model) => model.name === target.resp.origin) || null
  }

  /**
   * Inject a model into a dependence
   */
  injectIntoDependence (modelName) {
    const dependence = new Dependence(modelName, true, false)
    dependence.onlyName = true
    dependence.addChild(modelName)

    return dependence
  }

  /**
   * Resolve path of a given dependence
   */
  resolvePath (dep = new Dependence()) {
    const name = dep.module
    const model = this.models.find((model) => model.name === name)
    if (model) {
      dep.module = model.modulePath
    }
  }

  // Helpers
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
  }
}
