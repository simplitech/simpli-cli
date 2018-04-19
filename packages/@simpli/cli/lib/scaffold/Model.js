const map = require('lodash.map')
const Attr = require('./Attr')
const Resource = require('./Resource')
const Resp = require('./Resp')
const Dependence = require('./Dependence')
const startCase = require('lodash.startcase')

module.exports = class Model {
  constructor (name, definition, path, apis) {
    // Model name //e.g User
    this.name = name || ''

    // Attributes
    this.attrs = []

    /**
     * ############# *** MODEL DEFINITION *** #############
     * -- Possible scenarios
     * Simple Model: 000                 //e.g. LoginHolder
     * Simple Resp Model: 010            //e.g. LoginResp
     * Resource Models: 100              //e.g. User
     * Resp Resource Models: 110         //e.g. UserResp
     * Paged Resp Resource Model: 101    //e.g. PagedRespUser
     *
     * -- Impossible scenarios: 001, 011, 111
     * ####################################################
     */
    this.isResource = null
    this.isResp = null
    this.isPagedResp = null

    // only for resource
    this.resource = new Resource()
    // only for resp
    this.resp = new Resp()

    // APIs
    this.apis = []

    // Dependencies to import
    this.dependencies = []

    this.setAttr(name, definition.properties, definition.required)
    this.setDefinition(path)
    this.setAPIs(apis)
    this.setDependencies()
  }

  /**
   * Filter attrs by isObject
   */
  get objectAtrrs () {
    return this.attrs.filter((attr) => attr.isObject)
  }

  /**
   * Filter attrs by isArray
   */
  get arrayAtrrs () {
    return this.attrs.filter((attr) => attr.isArray)
  }

  /**
   * Get module path
   */
  get modulePath () {
    if (!this.isResource && !this.isResp && !this.isPagedResp) return `@/model/${this.name}`
    if (!this.isResource && this.isResp && !this.isPagedResp) return `@/model/response/${this.name}`
    if (this.isResource && !this.isResp && !this.isPagedResp) return `@/model/resource/${this.name}`
    if (this.isResource && this.isResp && !this.isPagedResp) return `@/model/resource/response/${this.name}`
    if (this.isResource && !this.isResp && this.isPagedResp) return `@/model/collection/${this.name}`
  }

  /**
   * Populate attributes
   * @param belongsTo This model name
   * @param property Properties from swagger
   * @param required Requirements from swagger
   */
  setAttr (belongsTo, property = {}, required = []) {
    const attrs = map(property, (prop, name) => new Attr(name, belongsTo, prop)) || []

    required.forEach((name) => {
      const attr = attrs.find((attr) => attr.name === name)
      attr.isRequired = true
    })

    this.attrs = attrs

    attrs.forEach((attr) => {
      const pattern = /^(?:id)(\w+)(?:Fk)$/g
      const match = pattern.exec(attr.name)
      if (match) {
        const result = (match[1] || '')
        const foreign = result.charAt(0).toLowerCase() + result.slice(1)
        const foreignAttr = this.objectAtrrs.find((attr) => attr.name === foreign)
        if (foreignAttr) {
          attr.foreign = foreignAttr.name
          attr.foreignType = foreignAttr.type
        }
      }
    })
  }

  /**
   * -- Set if model is:
   * Simple Model
   * Simple Resp Model
   * Resource Models
   * Resp Resource Models
   * Paged Resp Resource Model
   * @param path Path from swagger
   */
  setDefinition (path) {
    this.isResource = false
    this.isResp = false
    this.isPagedResp = false

    if (this.name.match(/^\w+(Resp)$/)) this.defineResp()

    else if (this.name.match(/^(PagedResp)\w+$/)) this.definePagedResp()

    // Get WS endpoint
    const wsEndpoint = Object.keys(path).find((endpoint) => {
      const regex = new RegExp(`^\/\\w+\/(?:${this.resp.origin || this.name})(?:\/\{\\w+\})+$`, 'g')
      return endpoint.match(regex)
    })

    if (wsEndpoint) this.defineResource(wsEndpoint)
  }

  defineResp () {
    this.isResp = true
    this.isPagedResp = false

    const pattern = /(\w+)(?:Resp)/g
    const match = pattern.exec(this.name)
    const attr = this.attrs.find((attr) => attr.type === (match && match[1]))
    this.resp.setOrigin(attr && attr.type)
  }

  definePagedResp () {
    this.isResource = true
    this.isResp = false
    this.isPagedResp = true

    const pattern = /(?:PagedResp)(\w+)/g
    const match = pattern.exec(this.name)
    const attr = this.attrs.find((attr) => attr.type === (match && match[1]))
    this.resp.setOrigin(attr && attr.type)
  }

  defineResource (wsEndpoint) {
    this.isResource = true
    this.resource.setEndpoint(wsEndpoint)

    let keyID, keyTAG
    if (!this.resp.origin) {
      const attrID = this.attrs.find((attr) => attr.type === 'ID')
      const attrTAG = this.attrs.find((attr) => attr.type === 'TAG')
      keyID = attrID && attrID.name
      keyTAG = attrTAG && attrTAG.name
    } else {
      const attr = this.attrs.find((attr) => attr.type === this.resp.origin)
      keyID = `${attr && attr.name}.$id`
      keyTAG = `${attr && attr.name}.$tag`
    }

    this.resource.setKeys(keyID, keyTAG)
  }

  /**
   * Populates all APIs (not included CRUD APIs)
   */
  setAPIs (apis = []) {
    this.apis = apis.filter((api) => api.respModel === this.name)
    // Remove CRUD APIs
    this.apis = this.apis.filter((api) => {
      const regex = new RegExp(`^\/\\w+\/(?:${this.resp.origin || this.name})(?:\/\{\\w+\})*$`, 'g')
      return !(api.endpoint || '').match(regex)
    })
  }

  /**
   * Populates all dependencies
   */
  setDependencies () {
    const dependencies = []
    const simpliModule = '@/simpli'
    const modelModule = '@/model'

    const simpliCommons = new Dependence(simpliModule)
    const simpliDecorator = new Dependence(simpliModule, false)
    const simpliMisc = new Dependence(simpliModule)
    const models = new Dependence(modelModule)

    this.populateSimpliCommons(simpliCommons)
    this.populateSimpliDecorator(simpliDecorator)
    this.populateSimpliMisc(simpliMisc)
    this.populateModels(models)

    if (simpliCommons.hasChildren) dependencies.push(simpliCommons)
    if (simpliDecorator.hasChildren) dependencies.push(simpliDecorator)
    if (simpliMisc.hasChildren) dependencies.push(simpliMisc)
    if (models.hasChildren) dependencies.push(models)

    this.dependencies = dependencies
  }

  populateSimpliCommons (dep = new Dependence()) {
    if (this.isResource) {
      dep.addChild('Resource')
      dep.addChild('ID')
      if (this.resource.keyTAG) dep.addChild('TAG')
    } else {
      dep.addChild('Model')
    }
  }

  populateSimpliDecorator (dep = new Dependence()) {
    this.attrs.forEach((attr) => {
      attr.responses.forEach((response) => {
        dep.addChild(response.title)
      })

      attr.validations.forEach((validation) => {
        dep.addChild(validation.title)
      })
    })
  }

  populateSimpliMisc (dep = new Dependence()) {
    const hasBoolean = !!this.attrs.find((attr) => attr.isBoolean)
    const hasDate = !!this.attrs.find((attr) => attr.isDate)
    const hasDatetime = !!this.attrs.find((attr) => attr.isDatetime)
    const hasUrl = !!this.attrs.find((attr) => attr.isUrl)
    const hasImageUrl = !!this.attrs.find((attr) => attr.isImageUrl)
    const hasPhone = !!this.attrs.find((attr) => attr.isPhone)
    const hasCpf = !!this.attrs.find((attr) => attr.isCpf)
    const hasCnpj = !!this.attrs.find((attr) => attr.isCnpj)

    if (hasBoolean) dep.addChild('bool')
    if (hasDate) dep.addChild('date')
    if (hasDatetime) dep.addChild('datetime')
    if (hasUrl) dep.addChild('AnchorRender')
    if (hasImageUrl) dep.addChild('ImageRender')
    if (hasPhone) dep.addChild('phone')
    if (hasCpf) dep.addChild('cpf')
    if (hasCnpj) dep.addChild('cnpj')
  }

  populateModels (dep = new Dependence()) {
    this.objectAtrrs.forEach((attr) => {
      dep.addChild(attr.type)
    })

    this.arrayAtrrs.forEach((attr) => {
      dep.addChild(attr.type)
    })

    const apisWithModel = this.apis.filter((attr) => attr.bodyModel)
    apisWithModel.forEach((api) => {
      dep.addChild(api.bodyModel)
    })
  }

  /**
   * Print the resource header into the template generator
   */
  buildResource () {
    let result = ''
    if (!this.isResource) return result

    result += `  readonly $endpoint: string = '${this.resource.endpoint}'\n\n`

    result += `  get $id() {\n`
    if (this.resource.keyID) {
      result += `    return this.${this.resource.keyID}\n`
    } else {
      result += `    return 0\n`
    }
    result += `  }\n`

    result += `  set $id(val: ID) {\n`
    if (this.resource.keyID) {
      result += `    this.${this.resource.keyID} = val\n`
    } else {
      result += `    /**/`
    }
    result += `  }\n`

    if (this.resource.keyTAG) {
      result += `  get $tag() {\n`
      result += `    return this.${this.resource.keyTAG}\n`
      result += `  }\n`
      result += `  set $tag(val: TAG) {\n`
      result += `    this.${this.resource.keyTAG} = val\n`
      result += `  }\n`
    }

    return result
  }

  /**
   * Print the scheme method into the template generator
   */
  buildScheme (isCsv = false) {
    let result = ''
    if (!this.isResource) return result
    // Exclude the hidden attributes
    const attrs = this.attrs.filter((attr) => !attr.responses.find((resp) => resp.title === 'ResponseHidden'))
    const methodName = !isCsv ? 'scheme' : 'csvScheme'

    result += `  ${methodName}() {\n`
    result += `    return {\n`
    attrs.forEach((attr) => {
      if (attr.isObject) {
        result += `      ${attr.name}: this.${attr.name}.$id,\n`
      } else if (attr.isUrl && !isCsv) {
        result += `      ${attr.name}: new AnchorRender(this.${attr.name}, this.${attr.name}, '_blank').toHtml(),\n`
      } else if (attr.isImageUrl && !isCsv) {
        result += `      ${attr.name}: new ImageRender(this.${attr.name}).toHtml(),\n`
      } else if (attr.isBoolean) {
        result += `      ${attr.name}: bool(this.${attr.name}),\n`
      } else if (attr.isDate) {
        result += `      ${attr.name}: date(this.${attr.name}),\n`
      } else if (attr.isDatetime) {
        result += `      ${attr.name}: datetime(this.${attr.name}),\n`
      } else if (attr.isPhone) {
        result += `      ${attr.name}: phone(this.${attr.name}),\n`
      } else if (attr.isCpf) {
        result += `      ${attr.name}: cpf(this.${attr.name}),\n`
      } else if (attr.isCnpj) {
        result += `      ${attr.name}: cnpj(this.${attr.name}),\n`
      } else if (!attr.isArray && !attr.isForeign) {
        result += `      ${attr.name}: this.${attr.name},\n`
      }
    })
    result += `    }\n`
    result += `  }\n`

    return result
  }

  /**
   * Print the locale classes into the template generator
   */
  buildLocale () {
    let result = ''

    result += `    ${this.name}: {\n`
    result += `      title: '${startCase(this.name)}',\n`
    if (this.attrs.length > 0) {
      result += `      columns: {\n`
      this.attrs.forEach((attr) => {
        result += `        ${attr.name}: '${startCase(attr.name)}',\n`
      })
      result += `      },\n`
    }
    result += `    },\n`

    return result
  }
}
