const map = require('lodash.map')
const Attr = require('./Attr')
const Resource = require('./Resource')
const Resp = require('./Resp')
const Dependence = require('./Dependence')
const startCase = require('lodash.startcase')
const uniqBy = require('lodash.uniqby')

module.exports = class Model {
  constructor (name, definition, path, apis) {
    // Model name //e.g User
    this.name = name || ''

    // Model description (not mandatory)
    this.description = definition.description || null

    // Model module //e.g @/model/User
    this.module = null

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
    this.schemaDependencies = []

    this.setAttr(name, definition.properties, definition.required)
    this.setDefinition(path)
    this.setAPIs(apis)
    this.setDependencies()
    this.setSchemaDependencies()
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
   * Filter attrs by non-foreign
   */
  get nonForeignAtrrs () {
    return this.attrs.filter((attr) => !attr.isForeign)
  }

  /**
   * Only resolved dependencies
   */
  get resolvedDependencies () {
    return this.dependencies.filter((dep) => dep.resolved)
  }

  /**
   * Only resolved schema dependencies
   */
  get resolvedSchemaDependencies () {
    return this.schemaDependencies.filter((dep) => dep.resolved)
  }

  /**
   * Only non-resolved dependencies
   */
  get notResolvedDependencies () {
    return this.dependencies.filter((dep) => !dep.resolved)
  }

  /**
   * Has reset password API
   */
  get hasResetPassword () {
    return !!this.apis.find((api) => api.name === 'resetPassword')
  }

  /**
   * Has Hash Attr
   */
  get hasHashAttr () {
    return !!this.attrs.find((attr) => attr.name === 'hash')
  }

  /**
   * Has recover password API
   */
  get hasRecoverPassword () {
    return !!this.apis.find((api) => api.name === 'recoverPassword')
  }

  /**
   * Set module
   */
  resolveModule () {
    if (!this.isResource && !this.isResp && !this.isPagedResp) this.module = `@/model/${this.name}`
    if (!this.isResource && this.isResp && !this.isPagedResp) this.module = `@/model/response/${this.name}`
    if (this.isResource && !this.isResp && !this.isPagedResp) this.module = `@/model/resource/${this.name}`
    if (this.isResource && this.isResp && !this.isPagedResp) this.module = `@/model/resource/response/${this.name}`
    if (this.isResource && !this.isResp && this.isPagedResp) this.module = `@/model/collection/${this.name}`
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
          attr.foreignIsRequired = foreignAttr.isRequired
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
      // Find any endpoint with this format: /###/[name]/{###}
      const regex = new RegExp(`^(?:\\/\\w+)*\\/${this.resp.origin || this.name}(?:\\/\\{\\w+\\})+$`, 'gi')
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
    this.resp.setOriginAttr(attr && attr.name)

    // Set fromResp
    this.attrs.forEach((attr) => {
      attr.fromResp = true
    })
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
      keyID = `${attr && attr.name}`
      keyTAG = `${attr && attr.name}`
    }

    this.resource.setKeys(keyID, keyTAG)

    const deletable = !!this.attrs.find((attr) => attr.isSoftDelete)
    this.resource.setDeletable(deletable)
  }

  /**
   * Populates all APIs (not included CRUD APIs)
   */
  setAPIs (apis = []) {
    const conditionsOr = (api) => [
      api.respModel === this.name, // or
      !api.respModel && api.hasTag(this.name), // or
      !api.respModel && !api.hasTag(this.name) && !api.tags.length && api.body.model === this.name
    ]
    // Get APIs which have the same response model, body model or tag of this model
    this.apis = apis.filter((api) => !!conditionsOr(api).find((item) => item))
  }

  /**
   * Populates all dependencies
   */
  setDependencies () {
    const dependencies = []
    const simpliModule = '@/simpli'

    const simpliCommons = new Dependence(simpliModule)
    const simpliDecorator = new Dependence(simpliModule, false)

    this.populateSimpliCommons(simpliCommons)
    this.populateSimpliDecorator(simpliDecorator)

    if (simpliCommons.hasChildren) dependencies.push(simpliCommons)
    if (simpliDecorator.hasChildren) dependencies.push(simpliDecorator)
    dependencies.push(...this.generateModelResources())

    // Add Schema
    if (this.isResource && !this.isResp && !this.isPagedResp) {
      const modelResource = new Dependence(`@/schema/${this.name}.schema`, true, false)
      modelResource.addChild(`${this.name}Schema`)
      dependencies.push(modelResource)
    }

    this.dependencies = dependencies
  }

  /**
   * Populates all dependencies of Schema
   */
  setSchemaDependencies () {
    const dependencies = []
    const simpliModule = '@/simpli'

    const simpliSchemaCommons = new Dependence(simpliModule)
    const simpliMisc = new Dependence(simpliModule)

    this.populateSimpliSchemaCommons(simpliSchemaCommons)
    this.populateSimpliMisc(simpliMisc)

    if (simpliSchemaCommons.hasChildren) dependencies.push(simpliSchemaCommons)
    if (simpliMisc.hasChildren) dependencies.push(simpliMisc)

    // Add this model
    if (this.isResource && !this.isResp && !this.isPagedResp) {
      const modelResource = new Dependence(`@/model/resource/${this.name}`, true, false)
      modelResource.addChild(this.name)
      dependencies.push(modelResource)
    }

    this.schemaDependencies = dependencies
  }

  populateSimpliCommons (dep = new Dependence()) {
    dep.addChild('$')
    if (this.isResource) {
      dep.addChild('Resource')
      dep.addChild('ID')
      if (this.resource.keyTAG) dep.addChild('TAG')
    } else {
      const hasID = !!this.attrs.find((attr) => attr.isID || attr.isForeign)
      if (hasID) dep.addChild('ID')
      dep.addChild('Model')
      dep.addChild('sleep')
      dep.addChild('encrypt')
    }
  }

  populateSimpliSchemaCommons (dep = new Dependence()) {
    dep.addChild('Schema')
    dep.addChild('InputType')
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
    const hasZipcode = !!this.attrs.find((attr) => attr.isZipcode)
    const hasCpf = !!this.attrs.find((attr) => attr.isCpf)
    const hasCnpj = !!this.attrs.find((attr) => attr.isCnpj)

    if (hasBoolean) dep.addChild('bool')
    if (hasDate) dep.addChild('date')
    if (hasDatetime) dep.addChild('datetime')
    if (hasUrl) dep.addChild('RenderAnchor')
    if (hasImageUrl) dep.addChild('RenderImage')
    if (hasPhone) dep.addChild('phone')
    if (hasZipcode) dep.addChild('cep')
    if (hasCpf) dep.addChild('cpf')
    if (hasCnpj) dep.addChild('cnpj')
  }

  generateModelResources () {
    const list = []

    this.objectAtrrs.forEach((attr) => {
      const modelResource = new Dependence(attr.type, true, false)
      modelResource.resolved = false
      modelResource.addChild(attr.type)
      if (attr.type !== this.name) list.push(modelResource)
    })

    this.arrayAtrrs.forEach((attr) => {
      const modelResource = new Dependence(attr.type, true, false)
      modelResource.resolved = false
      modelResource.addChild(attr.type)
      if (attr.type !== this.name) list.push(modelResource)
    })

    const apisWithModel = this.apis.filter((attr) => attr.body.model)
    apisWithModel.forEach((api) => {
      const modelResource = new Dependence(api.body.model, true, false)
      modelResource.resolved = false
      modelResource.addChild(api.body.model)
      if (api.body.model !== this.name) list.push(modelResource)
    })

    return uniqBy(list, 'module') || []
  }

  /**
   * Inject this model into a dependence
   */
  injectIntoDependence () {
    const dependence = new Dependence(this.module || this.name, true, false)
    if (!this.module) dependence.resolved = false
    dependence.addChild(this.name)

    return dependence
  }

  /**
   * Print the resource header into the template generator
   */
  buildResource () {
    let result = ''
    if (!this.isResource) return result
    const attrFromID = this.attrs.find((attr) => attr.name === this.resource.keyID)
    const attrFromTAG = this.attrs.find((attr) => attr.name === this.resource.keyTAG)

    result += `  readonly $name: string = '${this.name}'\n`
    result += `  readonly $endpoint: string = '${this.resource.endpoint}'\n\n`

    if (!this.isResp) {
      result += `  get $schema() {\n`
      result += `    return ${this.name}Schema(this)\n`
      result += `  }\n\n`
    }

    result += `  get $id() {\n`
    if (attrFromID && !attrFromID.isArrayOrigin) {
      if (attrFromID.isObjectOrigin) {
        if (!attrFromID.isRequired && !attrFromID.fromResp) {
          result += `    if (!this.${attrFromID.name}) return 0\n`
        }
        result += `    return this.${attrFromID.name}.$id\n`
      } else {
        result += `    return this.${attrFromID.name}\n`
      }
    } else {
      result += `    /* TODO: define the ID */\n`
      result += `    return 0\n`
    }
    result += `  }\n`

    result += `  set $id(val: ID) {\n`
    if (attrFromID && !attrFromID.isArrayOrigin) {
      if (attrFromID.isObjectOrigin) {
        if (!attrFromID.isRequired && !attrFromID.fromResp) {
          result += `    if (!this.${attrFromID.name}) this.${attrFromID.name} = new ${attrFromID.type}()\n`
        }
        result += `    this.${attrFromID.name}.$id = val\n`
      } else {
        result += `    this.${attrFromID.name} = val\n`
      }
    } else {
      result += `    /* TODO: define the ID */\n`
    }
    result += `  }\n`

    if (attrFromTAG && !attrFromTAG.isArrayOrigin) {
      if (attrFromTAG.isObjectOrigin) {
        result += `  get $tag() {\n`
        if (!attrFromTAG.isRequired && !attrFromID.fromResp) {
          result += `    if (!this.${attrFromTAG.name}) return ''\n`
        }
        result += `    return this.${attrFromTAG.name}.$tag\n`
        result += `  }\n`
        result += `  set $tag(val: TAG) {\n`
        if (!attrFromTAG.isRequired && !attrFromID.fromResp) {
          result += `    if (!this.${attrFromTAG.name}) this.${attrFromTAG.name} = new ${attrFromTAG.type}()\n`
        }
        result += `    this.${attrFromTAG.name}.$tag = val\n`
        result += `  }\n`
      } else {
        result += `  get $tag() {\n`
        result += `    return this.${this.resource.keyTAG}\n`
        result += `  }\n`
        result += `  set $tag(val: TAG) {\n`
        result += `    this.${this.resource.keyTAG} = val\n`
        result += `  }\n`
      }
    }

    return result
  }

  /**
   * Print the schema into the template generator
   */
  buildSchema () {
    let result = ''
    if (!this.isResource) return result

    this.nonForeignAtrrs.forEach((attr) => {
      result += `  ${attr.name}: {\n`
      if (attr.isObjectOrigin && attr.isObjectResource) {
        if (attr.isRequired) {
          result += `    content: model.${attr.name}.$id,\n`
        } else {
          result += `    content: model.${attr.name} && model.${attr.name}.$id,\n`
        }
        result += `    inputType: InputType.SELECT,\n`
      } else if (attr.isArrayOrigin) {
        result += `    hidden: true,\n`
        result += `    inputType: InputType.SELECT,\n`
      } else if (attr.isID) {
        result += `    content: model.${attr.name},\n`
        result += `    editable: false,\n`
      } else if (attr.isSoftDelete) {
        result += `    content: bool(model.${attr.name}),\n`
        result += `    hidden: true,\n`
        result += `    editable: false,\n`
      } else if (attr.isUrl) {
        result += `    content: {\n`
        result += `      component: RenderAnchor,\n`
        result += `      props: {\n`
        result += `        href: model.${attr.name},\n`
        result += `        label: model.${attr.name},\n`
        result += `        target: '_black',\n`
        result += `      },\n`
        result += `    },\n`
        result += `    textContent: model.${attr.name},\n`
        result += `    inputType: InputType.TEXT,\n`
        result += `    meta: {\n`
        if (attr.isRequired) {
          result += `      required: true,\n`
        }
        result += `      maxlength: '255',\n`
        result += `    },\n`
      } else if (attr.isImageUrl) {
        result += `    content: {\n`
        result += `      component: RenderImage,\n`
        result += `      props: {\n`
        result += `        src: model.${attr.name},\n`
        result += `        alt: model.$tag,\n`
        result += `      },\n`
        result += `    },\n`
        result += `    textContent: model.${attr.name},\n`
        result += `    inputType: InputType.TEXT,\n`
        result += `    meta: {\n`
        if (attr.isRequired) {
          result += `      required: true,\n`
        }
        result += `      maxlength: '255',\n`
        result += `    },\n`
      } else if (attr.isBoolean) {
        result += `    content: bool(model.${attr.name}),\n`
        result += `    inputType: InputType.CHECKBOX,\n`
      } else if (attr.isDate) {
        result += `    content: date(model.${attr.name}),\n`
        result += `    inputType: InputType.DATETIME,\n`
        if (attr.isRequired) {
          result += `    meta: {\n`
          result += `      required: true,\n`
          result += `    },\n`
        }
      } else if (attr.isDatetime) {
        result += `    content: datetime(model.${attr.name}),\n`
        result += `    inputType: InputType.DATETIME,\n`
        if (attr.isRequired) {
          result += `    meta: {\n`
          result += `      required: true,\n`
          result += `    },\n`
        }
      } else if (attr.isMoney) {
        result += `    content: model.${attr.name},\n`
        result += `    inputType: InputType.CURRENCY,\n`
        if (attr.isRequired) {
          result += `    meta: {\n`
          result += `      required: true,\n`
          result += `    },\n`
        }
      } else if (attr.isInteger || attr.isDouble) {
        result += `    content: model.${attr.name},\n`
        result += `    inputType: InputType.NUMBER,\n`
        result += `    meta: {\n`
        if (attr.isRequired) {
          result += `      required: true,\n`
        }
        if (attr.isInteger) {
          result += `      step: '1',\n`
        } else if (attr.isDouble) {
          result += `      step: 'any',\n`
        }
        result += `    },\n`
      } else if (attr.isEmail) {
        result += `    content: model.${attr.name},\n`
        result += `    inputType: InputType.EMAIL,\n`
        if (attr.isRequired) {
          result += `    meta: {\n`
          result += `      required: true,\n`
          result += `    },\n`
        }
      } else if (attr.isPassword) {
        result += `    content: model.${attr.name},\n`
        result += `    hidden: true,\n`
        result += `    inputType: InputType.PASSWORD,\n`
        if (attr.isRequired) {
          result += `    meta: {\n`
          result += `      required: true,\n`
          result += `    },\n`
        }
      } else if (attr.isPhone) {
        result += `    content: phone(model.${attr.name}),\n`
        result += `    inputType: InputType.PHONE,\n`
        if (attr.isRequired) {
          result += `    meta: {\n`
          result += `      required: true,\n`
          result += `    },\n`
        }
      } else if (attr.isZipcode) {
        result += `    content: cep(model.${attr.name}),\n`
        result += `    inputType: InputType.CEP,\n`
        if (attr.isRequired) {
          result += `    meta: {\n`
          result += `      required: true,\n`
          result += `    },\n`
        }
      } else if (attr.isCpf) {
        result += `    content: cpf(model.${attr.name}),\n`
        result += `    inputType: InputType.CPF,\n`
        if (attr.isRequired) {
          result += `    meta: {\n`
          result += `      required: true,\n`
          result += `    },\n`
        }
      } else if (attr.isCnpj) {
        result += `    content: cnpj(model.${attr.name}),\n`
        result += `    inputType: InputType.CNPJ,\n`
        if (attr.isRequired) {
          result += `    meta: {\n`
          result += `      required: true,\n`
          result += `    },\n`
        }
      } else {
        result += `    content: model.${attr.name},\n`
        result += `    inputType: InputType.TEXT,\n`
        result += `    meta: {\n`
        if (attr.isRequired) {
          result += `      required: true,\n`
        }
        result += `      maxlength: '255',\n`
        result += `    },\n`
      }

      result += `  },\n\n`
    })

    result = result.slice(0, -2) // remove last line
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

  buildPersistRespResourceGetter (origin = new Model()) {
    let result = ''

    this.arrayAtrrs.forEach((attr) => {
      const attrs = origin.attrs.filter((attrOrigin) => attrOrigin.type === attr.type)

      attrs.forEach((attrResource) => {
        result += `        ${attrResource.name}: this.model.${attr.name},\n`
      })
    })

    result = result.slice(0, -2) // remove last line

    return result
  }
}
