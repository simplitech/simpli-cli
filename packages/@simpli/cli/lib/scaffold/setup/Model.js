const map = require('lodash.map')
const ModelType = require('./ModelType')
const Attr = require('./Attr')
const Resource = require('./Resource')
const Dependence = require('./Dependence')
const startCase = require('lodash.startcase')
const camelCase = require('lodash.camelcase')
const kebabCase = require('lodash.kebabcase')
const uniqBy = require('lodash.uniqby')

module.exports = class Model {
  constructor (name, definition, path, apis) {
    // Model name //e.g User
    this.name = name || ''

    // Attribute name //e.g user
    this.attrName = camelCase(name || '')

    // Model description (not mandatory)
    this.description = definition.description || null

    // Model module //e.g @/model/User
    this.module = null

    // Attributes
    this.attrs = []

    // Model type
    this.type = ModelType.STANDARD

    // only for resource
    this.resource = new Resource()

    // APIs
    this.apis = []

    // Dependencies to import
    this.dependencies = []
    this.schemaDependencies = []
    this.persistDependencies = []

    this.setAttr(name, definition.properties, definition.required)
    this.setType(path)
    this.setAPIs(apis)
    this.resolveModule()
    this.setDependencies()
    this.setSchemaDependencies()
    this.setPersistDependencies()
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
   * Only resolved persist dependencies
   */
  get resolvedPersistDependencies () {
    return this.persistDependencies.filter((dep) => dep.resolved)
  }

  /**
   * Only non-resolved dependencies
   */
  get notResolvedDependencies () {
    const notResolvedDependencies = this.dependencies.filter((dep) => !dep.resolved)
    const notResolvedSchemaDependencies = this.schemaDependencies.filter((dep) => !dep.resolved)
    const notResolvedPersistDependencies = this.persistDependencies.filter((dep) => !dep.resolved)
    return [...notResolvedDependencies, ...notResolvedSchemaDependencies, ...notResolvedPersistDependencies]
  }

  /**
   * Set module
   */
  resolveModule () {
    switch (this.type) {
    case ModelType.RESOURCE:
      this.module = `@/model/resource/${this.name}`
      break
    case ModelType.REQUEST:
      this.module = `@/model/request/${this.name}`
      break
    case ModelType.RESPONSE:
      this.module = `@/model/response/${this.name}`
      break
    case ModelType.PAGINATED:
      this.module = `@/model/paginated/${this.name}`
      break
    default:
      this.module = `@/model/${this.name}`
      break
    }
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
   * Set if model is:
   * STANDARD
   * RESOURCE
   * REQUEST
   * RESPONSE
   * PAGINATED
   * @param path Path from swagger
   */
  setType (path) {
    this.defineRequest()
    this.defineResponse()
    this.definePaginated()
    this.defineResource(path)
  }

  /**
   * Get WS endpoint and define if the model is a resource
   */
  findWsEndpoint (path) {
    return Object.keys(path).find((endpoint) => {
      // Find any endpoint with this format: /###/[name]/{###}/{###}/...
      const regex = new RegExp(`^(?:\\/\\w+)*\\/${kebabCase(this.name)}(?:\\/{\\w+})+$`, 'gi')
      // e.g /admin/model/{id} -> resource detected!
      return endpoint.match(regex)
    })
  }

  defineResource (path) {
    const wsEndpoint = this.findWsEndpoint(path)
    if (!wsEndpoint) return

    this.type = ModelType.RESOURCE
    this.resource.setEndpoint(wsEndpoint)

    const attrID = this.attrs.find((attr) => attr.type === 'ID')
    const attrTAG = this.attrs.find((attr) => attr.type === 'TAG')

    this.resource.setKeys(attrID && attrID.name, attrTAG && attrTAG.name)

    const deletable = !!this.attrs.find((attr) => attr.isSoftDelete)
    this.resource.setDeletable(deletable)
  }

  defineRequest () {
    if (this.name.match(/^\w+(Request)$/)) {
      this.type = ModelType.REQUEST
    }
  }

  defineResponse () {
    if (this.name.match(/^\w+(Response)$/)) {
      this.type = ModelType.RESPONSE
    }
  }

  definePaginated () {
    if (this.name.match(/^(PagedResp)\w+$/)) {
      this.type = ModelType.PAGINATED
    }
  }

  is (type) {
    return this.type === type
  }

  get isStandard () {
    return this.is(ModelType.STANDARD)
  }

  get isResource () {
    return this.is(ModelType.RESOURCE)
  }

  get isRequest () {
    return this.is(ModelType.REQUEST)
  }

  get isResponse () {
    return this.is(ModelType.RESPONSE)
  }

  get isPaginated () {
    return this.is(ModelType.PAGINATED)
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
    if (this.isResource) {
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
    if (this.isResource) {
      const modelResource = new Dependence(`@/model/resource/${this.name}`, true, false)
      modelResource.addChild(this.name)
      dependencies.push(modelResource)
    }

    this.schemaDependencies = dependencies
  }

  /**
   * Populates all dependencies of Persist View
   */
  setPersistDependencies () {
    const dependencies = []

    this.objectAtrrs.forEach((attr) => {
      const modelResource = new Dependence(attr.type, true, false)
      modelResource.resolved = false
      modelResource.addChild(attr.type)
      if (attr.type !== this.name) dependencies.push(modelResource)
    })

    this.arrayAtrrs.forEach((attr) => {
      const modelResource = new Dependence(attr.type, true, false)
      modelResource.resolved = false
      modelResource.addChild(attr.type)
      if (attr.type !== this.name) dependencies.push(modelResource)
    })

    this.persistDependencies = uniqBy(dependencies, 'module') || []
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

    result += `  readonly $endpoint: string = '${this.resource.endpoint}'\n\n`

    result += `  get $schema() {\n`
    result += `    return ${this.name}Schema(this)\n`
    result += `  }\n\n`

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
        result += `    input: InputType.SELECT,\n`
      } else if (attr.isArrayOrigin) {
        result += `    hidden: true,\n`
        result += `    input: InputType.SELECT,\n`
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
        result += `    input: InputType.TEXT,\n`
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
        result += `    input: InputType.TEXT,\n`
        result += `    meta: {\n`
        if (attr.isRequired) {
          result += `      required: true,\n`
        }
        result += `      maxlength: '255',\n`
        result += `    },\n`
      } else if (attr.isBoolean) {
        result += `    content: bool(model.${attr.name}),\n`
        result += `    input: InputType.CHECKBOX,\n`
      } else if (attr.isDate) {
        result += `    content: date(model.${attr.name}),\n`
        result += `    input: InputType.DATETIME,\n`
        if (attr.isRequired) {
          result += `    meta: {\n`
          result += `      required: true,\n`
          result += `    },\n`
        }
      } else if (attr.isDatetime) {
        result += `    content: datetime(model.${attr.name}),\n`
        result += `    input: InputType.DATETIME,\n`
        if (attr.isRequired) {
          result += `    meta: {\n`
          result += `      required: true,\n`
          result += `    },\n`
        }
      } else if (attr.isMoney) {
        result += `    content: model.${attr.name},\n`
        result += `    input: InputType.CURRENCY,\n`
        if (attr.isRequired) {
          result += `    meta: {\n`
          result += `      required: true,\n`
          result += `    },\n`
        }
      } else if (attr.isInteger || attr.isDouble) {
        result += `    content: model.${attr.name},\n`
        result += `    input: InputType.NUMBER,\n`
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
        result += `    input: InputType.EMAIL,\n`
        if (attr.isRequired) {
          result += `    meta: {\n`
          result += `      required: true,\n`
          result += `    },\n`
        }
      } else if (attr.isPassword) {
        result += `    content: model.${attr.name},\n`
        result += `    hidden: true,\n`
        result += `    input: InputType.PASSWORD,\n`
        if (attr.isRequired) {
          result += `    meta: {\n`
          result += `      required: true,\n`
          result += `    },\n`
        }
      } else if (attr.isPhone) {
        result += `    content: phone(model.${attr.name}),\n`
        result += `    input: InputType.PHONE,\n`
        if (attr.isRequired) {
          result += `    meta: {\n`
          result += `      required: true,\n`
          result += `    },\n`
        }
      } else if (attr.isZipcode) {
        result += `    content: cep(model.${attr.name}),\n`
        result += `    input: InputType.CEP,\n`
        if (attr.isRequired) {
          result += `    meta: {\n`
          result += `      required: true,\n`
          result += `    },\n`
        }
      } else if (attr.isCpf) {
        result += `    content: cpf(model.${attr.name}),\n`
        result += `    input: InputType.CPF,\n`
        if (attr.isRequired) {
          result += `    meta: {\n`
          result += `      required: true,\n`
          result += `    },\n`
        }
      } else if (attr.isCnpj) {
        result += `    content: cnpj(model.${attr.name}),\n`
        result += `    input: InputType.CNPJ,\n`
        if (attr.isRequired) {
          result += `    meta: {\n`
          result += `      required: true,\n`
          result += `    },\n`
        }
      } else {
        result += `    content: model.${attr.name},\n`
        result += `    input: InputType.TEXT,\n`
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

  buildPersistResourceInstances () {
    let result = ''

    this.persistDependencies.forEach((dep) => {
      result += `    all${dep.children[0]} = new All(${dep.children[0]})\n`
    })

    return result
  }

  buildPersistResource () {
    let result = ''

    this.objectAtrrs.forEach((attr) => {
      result += `        ${attr.name}: this.all${attr.type}.items as ${attr.type}[],\n`
    })

    this.arrayAtrrs.forEach((attr) => {
      result += `        ${attr.name}: this.all${attr.type}.items as ${attr.type}[],\n`
    })

    result = result.slice(0, -1) // remove last line

    return result
  }
}
