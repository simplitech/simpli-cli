const map = require('lodash.map')
const Attr = require('./Attr')

module.exports = class Resource {
  constructor (name, definition, path) {
    this.name = name || ''
    this.endpoint = null
    this.endpointParams = []
    this.keyID = null
    this.keyTAG = null
    this.isResponse = null
    this.isPagedResponse = null
    this.child = null
    this.attrs = []

    this.setAttr(name, definition.properties, definition.required)
    this.setResponse()
    this.setEndpoint(path)
    this.setKey()
  }

  onlyObjects () {
    return this.attrs.filter((resource) => resource.isObject)
  }

  onlyArrays () {
    return this.attrs.filter((resource) => resource.isArray)
  }

  onlyRequired () {
    return this.attrs.filter((resource) => resource.isRequired)
  }

  setAttr (belongsTo, property = {}, required = []) {
    const attrs = map(property, (prop, name) => new Attr(name, belongsTo, prop)) || []

    required.forEach((name) => {
      const attr = attrs.find((attr) => attr.name === name)
      attr.isRequired = true
    })

    this.attrs = attrs
  }

  setEndpoint (path) {
    // Get WS endpoint
    const wsEndpoint = Object.keys(path).find((endpoint) => {
      const regex = new RegExp(`^\/\\w+\/(?:${this.child || this.name})(?:\/\{\\w+\})+$`, 'g')
      return endpoint.match(regex)
    }) || ''

    // Populate endpointParams
    const params = /{([^}]+)}/g
    let matchParams
    do {
      matchParams = params.exec(wsEndpoint)
      if (matchParams) this.endpointParams.push(matchParams[1])
    } while (matchParams)

    // Set endpoint
    const dir = /\/\w+[^\/]/g
    let matchDir
    do {
      matchDir = dir.exec(wsEndpoint)
      if (matchDir) {
        if (!this.endpoint) this.endpoint = ''
        this.endpoint += matchDir[0]
      }
    } while (matchDir)

    this.endpointParams.forEach((params) => {
      this.endpoint += `{/${params}}`
    })
  }

  setResponse () {
    this.isResponse = false
    this.isPagedResponse = false

    if (this.name.match(/^\w+(Resp)$/)) {
      this.isResponse = true
      this.isPagedResponse = false
    } if (this.name.match(/^(PagedResp)\w+$/)) {
      this.isResponse = false
      this.isPagedResponse = true
    }

    if (this.isResponse && this.onlyObjects()[0]) {
      this.child = this.onlyObjects()[0].type
    }
  }

  setKey () {
    if (!this.child) {
      const keyID = this.attrs.find((attr) => attr.type === 'ID')
      const keyTAG = this.attrs.find((attr) => attr.type === 'TAG')

      this.keyID = keyID ? keyID.name : null
      this.keyTAG = keyTAG ? keyTAG.name : null
    } else if (this.onlyObjects()[0]) {
      this.keyID = `${this.onlyObjects()[0].name}.$id`
      this.keyTAG = `${this.onlyObjects()[0].name}.$tag`
    }
  }
}
