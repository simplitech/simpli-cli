const map = require('lodash.map')
const Model = require('./Model')
const camelCase = require('lodash.camelcase')
const kebabCase = require('lodash.kebabcase')
const snakeCase = require('lodash.snakecase')

module.exports = class ScaffoldSetup {
  constructor () {
    this.appName = null
    this.swaggerUrl = null
    this.apiUrlDev = null
    this.apiUrlProd = null
    this.userModel = 'User'
    this.availableLanguages = null
    this.defaultLanguage = null
    this.defaultCurrency = null
    this.models = []
  }

  // Get Models
  exceptResources () {
    return this.models.filter((resource) => !resource.isResource)
  }

  // Get all kinds of Resources (simple, resp or paged)
  onlyResources () {
    return this.models.filter((resource) => resource.isResource)
  }

  // Get simple Resources
  exceptResponses () {
    return this.models.filter((resource) => resource.isResource && !resource.isResponse && !resource.isPagedResponse)
  }

  // Get resp Resources
  onlyResponses () {
    return this.models.filter((resource) => resource.isResponse)
  }

  // Get paged Resources
  onlyPagedResponses () {
    return this.models.filter((resource) => resource.isPagedResponse)
  }

  // Get simple and resp Resources
  exceptPagedResponses () {
    return this.models.filter((resource) => !resource.isPagedResponse)
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

  setModels (definition = {}, path = {}) {
    this.models = map(definition, (def, name) => new Model(name, def, path)) || []
  }
}
