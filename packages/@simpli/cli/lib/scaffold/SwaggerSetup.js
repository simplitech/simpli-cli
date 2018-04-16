const map = require('lodash.map')
const Resource = require('./Resource')

module.exports = class SwaggerSetup {
  constructor () {
    this.title = null
    this.apiUrl = null
    this.resources = []
  }

  nonResponses () {
    return this.resources.filter((resource) => !resource.isResponse && !resource.isPagedResponse)
  }

  onlyResourceResponses () {
    return this.resources.filter((resource) => resource.isResponse)
  }

  nonPaged () {
    return this.resources.filter((resource) => !resource.isPagedResponse)
  }

  onlyPagedResponses () {
    return this.resources.filter((resource) => resource.isPagedResponse)
  }

  setResources (definition = {}, path = {}) {
    this.resources = map(definition, (def, name) => new Resource(name, def, path)) || []
  }
}
