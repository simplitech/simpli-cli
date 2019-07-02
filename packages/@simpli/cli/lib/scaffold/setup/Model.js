const map = require('lodash.map')
const ModelType = require('./ModelType')
const Attr = require('./Attr')
const Resource = require('./Resource')
const Dependence = require('./Dependence')
const startCase = require('lodash.startcase')
const camelCase = require('lodash.camelcase')
const kebabCase = require('lodash.kebabcase')
const uniqBy = require('lodash.uniqby')
const Class = require('class-transformer')

module.exports = class Model {
  constructor (name, definition, path, apis) {
    // Model name //e.g User
    this.originalName = `${name || ''}`

    if (name.match(/^(PageCollection)\w+$/)) {
      name = `${name.replace(/^PageCollection/, '')}Collection`
    }
    // Model name //e.g User
    this.name = name || ''

    // Attribute name //e.g user
    this.attrName = camelCase(name || '')

    // Collection model name (null if not exists) //e.g UserCollection
    this.collectionName = null

    // Model description (not mandatory)
    this.description = definition.description || null

    // Model module //e.g @/model/resource/User
    this.module = null

    // Model type
    this.type = ModelType.STANDARD

    // only for resource
    this.resource = new Resource()

    // Attributes
    this.attrs = []

    // APIs
    this.apis = []

    // Dependencies to import
    this.dependencies = []
    this.persistDependencies = []

    this.setAttr(name, definition.properties, definition.required)
    this.setType(path)
    this.setAPIs(apis)
    this.resolveModule()
    this.setDependencies()
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
   * Filter attrs by foreign
   */
  get foreignAtrrs () {
    return this.attrs.filter((attr) => attr.isForeign)
  }

  /**
   * Filter attrs by non-foreign
   */
  get nonForeignAtrrs () {
    return this.attrs.filter((attr) => !attr.isForeign)
  }

  /**
   * Filter apis by resp type
   */
  get respObjectApis () {
    return this.apis.filter((api) => api.respModelType === 'object')
  }

  /**
   * Filter apis by body model
   */
  get bodyApis () {
    return this.apis.filter((attr) => attr.body.model)
  }

  /**
   * Only resolved dependencies
   */
  get resolvedDependencies () {
    return this.dependencies.filter((dep) => dep.resolved)
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
    const notResolvedPersistDependencies = this.persistDependencies.filter((dep) => !dep.resolved)
    return [...notResolvedDependencies, ...notResolvedPersistDependencies]
  }

  /**
   * Get the schema module of this model
   */
  getSchemaModule (schemaRef = '') {
    switch (this.type) {
    case ModelType.RESOURCE:
      return `@/schema/resource/${this.name}/${schemaRef}${this.name}Schema`
    case ModelType.REQUEST:
      return `@/schema/request/${this.name}/${schemaRef}${this.name}Schema`
    case ModelType.RESPONSE:
      return `@/schema/response/${this.name}/${schemaRef}${this.name}Schema`
    case ModelType.PAGINATED:
      return `@/schema/collection/${this.name}/${schemaRef}${this.name}Schema`
    default:
      return `@/schema/model/${this.name}/${schemaRef}${this.name}Schema`
    }
  }

  /**
   * Get the collection module of this model
   */
  getCollectionModule () {
    return `@/model/collection/${this.name}Collection`
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
      this.module = `@/model/collection/${this.name}`
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
    if (this.originalName.match(/^(PageCollection)\w+$/)) {
      this.type = ModelType.PAGINATED
    }
  }

  is (type) {
    return this.type === type
  }

  getApiByName (name) {
    return this.apis.find((api) => api.name === name)
  }

  get populateApi () {
    return this.apis.find((api) => api.methodUppercase === 'GET' && api.paths.find((path) => !!path.name.match(/^id\S*$/i))) || null
  }

  get persistApi () {
    return this.apis.find((api) => ['POST', 'PUT'].includes(api.methodUppercase) && api.body.model === this.name) || null
  }

  get removeApi () {
    return this.apis.find((api) => api.methodUppercase === 'DELETE' && api.paths.find((path) => !!path.name.match(/^id\S*$/i))) || null
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

  get itemModelName () {
    if (this.isPaginated) {
      return this.originalName.replace(/^PageCollection/, '')
    }
    return null
  }

  /**
   * Populates all APIs (not included CRUD APIs)
   */
  setAPIs (apis = []) {
    if (this.isPaginated) {
      this.apis = Class.classToClass(apis.filter((api) => api.respModel === this.name)) // clone
    } else {
      // Get APIs which belongs the same tag of this model name
      this.apis = Class.classToClass(apis.filter((api) => api.hasTag(this.name))) // clone
    }

    this.apis.forEach((api) => {
      api.belongsToModel = this.name
    })
  }

  /**
   * Populates all dependencies
   */
  setDependencies () {
    const dependencies = []
    const simpliModule = '@/simpli'

    // Add moment
    if (this.attrs.find((attr) => attr.isDate || attr.isDatetime)) {
      const momentDep = new Dependence(`moment`, true, false)
      momentDep.addChild('moment')
      dependencies.push(momentDep)
    }

    const simpliCommons = new Dependence(simpliModule)
    const simpliDecorator = new Dependence(simpliModule)

    this.populateSimpliCommons(simpliCommons)
    this.populateSimpliDecorator(simpliDecorator)

    if (simpliCommons.hasChildren) dependencies.push(simpliCommons)
    if (simpliDecorator.hasChildren) dependencies.push(simpliDecorator)
    dependencies.push(...this.generateModelResources())

    this.dependencies = dependencies
  }

  /**
   * Populates all dependencies of Persist View
   */
  setPersistDependencies () {
    const dependencies = []

    this.objectAtrrs.forEach((attr) => {
      const modelResource = new Dependence(attr.type)
      modelResource.resolved = false
      modelResource.addChild(attr.type)
      if (attr.type !== this.name) dependencies.push(modelResource)
    })

    this.arrayAtrrs.forEach((attr) => {
      const modelResource = new Dependence(attr.type)
      modelResource.resolved = false
      modelResource.addChild(attr.type)
      if (attr.type !== this.name) dependencies.push(modelResource)
    })

    this.persistDependencies = uniqBy(dependencies, 'module') || []
  }

  populateSimpliCommons (dep = new Dependence()) {
    dep.addChild('$')
    dep.addChild('Helper')
    dep.addChild('Request')
    if (this.isResource) {
      dep.addChild('Resource')
      dep.addChild('ID')
      if (this.resource.keyTAG) dep.addChild('TAG')
    } else {
      const hasID = !!this.attrs.find((attr) => attr.isID || attr.isForeign)
      if (hasID) dep.addChild('ID')
      dep.addChild('Model')
    }
  }

  populateSimpliDecorator (dep = new Dependence()) {
    this.attrs.forEach((attr) => {
      attr.responses.forEach((response) => {
        dep.addChild(response.title)
      })
    })
  }

  generateModelResources () {
    const list = []

    this.objectAtrrs.forEach((attr) => {
      const modelResource = new Dependence(attr.type)
      modelResource.resolved = false
      modelResource.addChild(attr.type)
      if (attr.type !== this.name) list.push(modelResource)
    })

    this.arrayAtrrs.forEach((attr) => {
      const modelResource = new Dependence(attr.type)
      modelResource.resolved = false
      modelResource.addChild(attr.type)
      if (attr.type !== this.name) list.push(modelResource)
    })

    // Add from APIs
    this.respObjectApis.forEach((api) => {
      const modelResource = new Dependence(api.respModel)
      modelResource.resolved = false
      modelResource.addChild(api.respModel)
      if (api.respModel !== this.name) list.push(modelResource)
    })

    // Add from APIs
    this.bodyApis.forEach((api) => {
      const modelResource = new Dependence(api.body.modele)
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
    const dependence = new Dependence(this.module || this.name)
    if (!this.module) dependence.resolved = false
    dependence.addChild(this.name)

    return dependence
  }

  /**
   * Inject the schema of this model into a dependence
   */
  injectSchemaIntoDependence (schemaRef = '', singleLine = true) {
    const dependence = new Dependence(this.getSchemaModule(schemaRef), singleLine)
    dependence.addChild(`${schemaRef}${this.name}Schema`)

    return dependence
  }

  /**
   * Inject the collection of this model into a dependence
   */
  injectCollectionIntoDependence () {
    if (this.collectionName) {
      const dependence = new Dependence(this.getCollectionModule())
      dependence.addChild(this.collectionName)

      return dependence
    }
    return ''
  }

  /**
   * Implode Resource IDs
   */
  implodeResourceIds (prefix) {
    let result = ''

    const attrFromID = this.attrs.find((attr) => attr.name === this.resource.keyID)
    if (attrFromID && !attrFromID.isArrayOrigin) {
      result += prefix ? `${prefix}.$id` : '$id'
    } else {
      this.foreignAtrrs.forEach((attr) => {
        result += prefix ? `${prefix}.${attr.name}, ` : `${attr.name}, `
      })
      result = result.slice(0, -2)
    }

    return result
  }

  /**
   * Print the resource header into the template generator
   */
  buildResource () {
    let result = ''
    if (!this.isResource) return result
    const attrFromID = this.attrs.find((attr) => attr.name === this.resource.keyID)
    const attrFromTAG = this.attrs.find((attr) => attr.name === this.resource.keyTAG)

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
  buildInputSchema () {
    let result = ''

    this.nonForeignAtrrs.forEach((attr) => {
      if (!attr.isID) {
        result += `    ${attr.name}: (schema): FieldComponent => ({\n`
        if (attr.isObjectOrigin && attr.isObjectResource) {
          result += `      is: Component.InputSelect,\n`
          result += `      bind: {\n`
          if (attr.isRequired) {
            result += `        required: true,\n`
          }
          result += `        label: this.translateFrom(schema.fieldName),\n`
          result += `      },\n`
        } else if (attr.isArrayOrigin) {
          result += `      is: Component.InputSelect,\n`
          result += `      bind: {\n`
          if (attr.isRequired) {
            result += `        required: true,\n`
          }
          result += `        label: this.translateFrom(schema.fieldName),\n`
          result += `      },\n`
        } else if (attr.isSoftDelete) {
          result += `      is: Component.InputCheckbox,\n`
          result += `      bind: {\n`
          result += `        label: this.translateFrom(schema.fieldName),\n`
          result += `        class: 'pretty p-default p-curve p-smooth',\n`
          result += `        labelClass: 'state',\n`
          result += `      },\n`
        } else if (attr.isUrl) {
          result += `      is: Component.InputText,\n`
          result += `      bind: {\n`
          result += `        type: 'text',\n`
          if (attr.isRequired) {
            result += `        required: true,\n`
          }
          result += `        maxlength: 255,\n`
          result += `        label: this.translateFrom(schema.fieldName),\n`
          result += `      },\n`
        } else if (attr.isImageUrl) {
          result += `      is: Component.InputText,\n`
          result += `      bind: {\n`
          result += `        type: 'text',\n`
          if (attr.isRequired) {
            result += `        required: true,\n`
          }
          result += `        maxlength: 255,\n`
          result += `        label: this.translateFrom(schema.fieldName),\n`
          result += `      },\n`
        } else if (attr.isBoolean) {
          result += `      is: Component.InputCheckbox,\n`
          result += `      bind: {\n`
          result += `        label: this.translateFrom(schema.fieldName),\n`
          result += `        class: 'pretty p-default p-curve p-smooth',\n`
          result += `        labelClass: 'state',\n`
          result += `      },\n`
        } else if (attr.isDate) {
          result += `      is: Component.InputText,\n`
          result += `      bind: {\n`
          result += `        type: 'mask',\n`
          result += `        maskPreset: 'date',\n`
          if (attr.isRequired) {
            result += `        required: true,\n`
          }
          result += `        label: this.translateFrom(schema.fieldName),\n`
          result += `      },\n`
        } else if (attr.isDatetime) {
          result += `      is: Component.InputText,\n`
          result += `      bind: {\n`
          result += `        type: 'mask',\n`
          result += `        maskPreset: 'datetime',\n`
          if (attr.isRequired) {
            result += `        required: true,\n`
          }
          result += `        label: this.translateFrom(schema.fieldName),\n`
          result += `      },\n`
        } else if (attr.isMoney) {
          result += `      is: Component.InputText,\n`
          result += `      bind: {\n`
          result += `        type: 'currency',\n`
          if (attr.isRequired) {
            result += `        required: true,\n`
          }
          result += `        label: this.translateFrom(schema.fieldName),\n`
          result += `      },\n`
        } else if (attr.isInteger || attr.isDouble) {
          result += `      is: Component.InputText,\n`
          result += `      bind: {\n`
          result += `        type: 'number',\n`
          if (attr.isRequired) {
            result += `        required: true,\n`
          }
          result += `        maxlength: 255,\n`
          if (attr.isInteger) {
            result += `        step: 1,\n`
          } else if (attr.isDouble) {
            result += `        step: 'any',\n`
          }
          result += `        label: this.translateFrom(schema.fieldName),\n`
          result += `      },\n`
        } else if (attr.isEmail) {
          result += `      is: Component.InputText,\n`
          result += `      bind: {\n`
          result += `        type: 'email',\n`
          if (attr.isRequired) {
            result += `        required: true,\n`
          }
          if (this.isRequest) {
            result += `        class: 'contrast',\n`
          }
          result += `        label: this.translateFrom(schema.fieldName),\n`
          result += `      },\n`
        } else if (attr.isPassword) {
          result += `      is: Component.InputText,\n`
          result += `      bind: {\n`
          result += `        type: 'password',\n`
          if (attr.isRequired) {
            result += `        required: true,\n`
          }
          if (this.isRequest) {
            result += `        class: 'contrast',\n`
          }
          result += `        label: this.translateFrom(schema.fieldName),\n`
          result += `      },\n`
        } else if (attr.isPhone) {
          result += `      is: Component.InputText,\n`
          result += `      bind: {\n`
          result += `        type: 'mask',\n`
          result += `        maskPreset: 'phone',\n`
          if (attr.isRequired) {
            result += `        required: true,\n`
          }
          result += `        label: this.translateFrom(schema.fieldName),\n`
          result += `      },\n`
        } else if (attr.isZipcode) {
          result += `      is: Component.InputText,\n`
          result += `      bind: {\n`
          result += `        type: 'mask',\n`
          result += `        maskPreset: 'zipcode',\n`
          if (attr.isRequired) {
            result += `        required: true,\n`
          }
          result += `        label: this.translateFrom(schema.fieldName),\n`
          result += `      },\n`
        } else if (attr.isCpf) {
          result += `      is: Component.InputText,\n`
          result += `      bind: {\n`
          result += `        type: 'mask',\n`
          result += `        maskPreset: 'cpf',\n`
          if (attr.isRequired) {
            result += `        required: true,\n`
          }
          result += `        label: this.translateFrom(schema.fieldName),\n`
          result += `      },\n`
        } else if (attr.isCnpj) {
          result += `      is: Component.InputText,\n`
          result += `      bind: {\n`
          result += `        type: 'mask',\n`
          result += `        maskPreset: 'cnpj',\n`
          if (attr.isRequired) {
            result += `        required: true,\n`
          }
          result += `        label: this.translateFrom(schema.fieldName),\n`
          result += `      },\n`
        } else if (attr.isRg) {
          result += `      is: Component.InputText,\n`
          result += `      bind: {\n`
          result += `        type: 'mask',\n`
          result += `        maskPreset: 'rg',\n`
          if (attr.isRequired) {
            result += `        required: true,\n`
          }
          result += `        label: this.translateFrom(schema.fieldName),\n`
          result += `      },\n`
        } else {
          result += `      is: Component.InputText,\n`
          result += `      bind: {\n`
          result += `        type: 'text',\n`
          if (attr.isRequired) {
            result += `        required: true,\n`
          }
          if (this.isRequest) {
            result += `        class: 'contrast',\n`
          }
          result += `        maxlength: 255,\n`
          result += `        label: this.translateFrom(schema.fieldName),\n`
          result += `      },\n`
        }

        result += this.buildAjv(attr)

        result += `    }),\n`
      }
    })

    result = result.slice(0, -1) // remove last line
    return result
  }

  /**
   * Print the schema into the template generator
   */
  buildListSchema () {
    let result = ''

    this.nonForeignAtrrs.forEach((attr) => {
      if (attr.isObjectOrigin) {
        result += `    ${attr.name}: (schema): FieldComponent => ({\n`
        result += `      is: Component.Render,\n`
        result += `      bind: {\n`
        if (attr.isObjectResource) {
          if (attr.isRequired) {
            result += `        content: schema.model.${attr.name}.$id,\n`
          } else {
            result += `        content: schema.model.${attr.name} && schema.model.${attr.name}.$id,\n`
          }
        } else {
          if (attr.isRequired) {
            result += `        // TODO: define the attribute\n`
            result += `        // content: schema.model.${attr.name}.$id,\n`
          } else {
            result += `        // TODO: define the attribute\n`
            result += `        // content: schema.model.${attr.name} && schema.model.${attr.name}.$id,\n`
          }
        }
        result += `      },\n`
        result += `    }),\n`
      } else if (attr.isArrayOrigin) {
      } else if (attr.isSoftDelete) {
        result += `    ${attr.name}: (schema): FieldComponent => ({\n`
        result += `      is: Component.Render,\n`
        result += `      bind: {\n`
        result += `        content: Helper.bool(schema.model.${attr.name}),\n`
        result += `      },\n`
        result += `    }),\n`
      } else if (attr.isUrl) {
        result += `    ${attr.name}: (schema): FieldComponent => ({\n`
        result += `      is: Component.RenderAnchor,\n`
        result += `      bind: {\n`
        result += `        href: schema.model.${attr.name},\n`
        result += `        label: schema.model.${attr.name},\n`
        result += `        target: '_blank',\n`
        result += `      },\n`
        result += `    }),\n`
      } else if (attr.isImageUrl) {
        result += `    ${attr.name}: (schema): FieldComponent => ({\n`
        result += `      is: Component.RenderImage,\n`
        result += `      bind: {\n`
        result += `        src: schema.model.${attr.name},\n`
        result += `        alt: this.translateFrom(schema.fieldName),\n`
        result += `        innerClass: 'w-50 h-50',\n`
        result += `      },\n`
        result += `    }),\n`
      } else if (attr.isBoolean) {
        result += `    ${attr.name}: (schema): FieldComponent => ({\n`
        result += `      is: Component.Render,\n`
        result += `      bind: {\n`
        result += `        content: Helper.bool(schema.model.${attr.name}),\n`
        result += `      },\n`
        result += `    }),\n`
      } else if (attr.isDate) {
        result += `    ${attr.name}: (schema): FieldComponent => ({\n`
        result += `      is: Component.Render,\n`
        result += `      bind: {\n`
        result += `        content: Helper.date(schema.model.${attr.name}),\n`
        result += `      },\n`
        result += `    }),\n`
      } else if (attr.isDatetime) {
        result += `    ${attr.name}: (schema): FieldComponent => ({\n`
        result += `      is: Component.Render,\n`
        result += `      bind: {\n`
        result += `        content: Helper.datetime(schema.model.${attr.name}),\n`
        result += `      },\n`
        result += `    }),\n`
      } else if (attr.isPassword) {
      } else if (attr.isPhone) {
        result += `    ${attr.name}: (schema): FieldComponent => ({\n`
        result += `      is: Component.Render,\n`
        result += `      bind: {\n`
        result += `        content: Helper.phone(schema.model.${attr.name}),\n`
        result += `      },\n`
        result += `    }),\n`
      } else if (attr.isCpf) {
        result += `    ${attr.name}: (schema): FieldComponent => ({\n`
        result += `      is: Component.Render,\n`
        result += `      bind: {\n`
        result += `        content: Helper.cpf(schema.model.${attr.name}),\n`
        result += `      },\n`
        result += `    }),\n`
      } else if (attr.isCnpj) {
        result += `    ${attr.name}: (schema): FieldComponent => ({\n`
        result += `      is: Component.Render,\n`
        result += `      bind: {\n`
        result += `        content: Helper.cnpj(schema.model.${attr.name}),\n`
        result += `      },\n`
        result += `    }),\n`
      } else if (attr.isRg) {
        result += `    ${attr.name}: (schema): FieldComponent => ({\n`
        result += `      is: Component.Render,\n`
        result += `      bind: {\n`
        result += `        content: Helper.rg(schema.model.${attr.name}),\n`
        result += `      },\n`
        result += `    }),\n`
      } else {
        result += `    ${attr.name}: (): FieldComponent => ({\n`
        result += `      is: Component.Render,\n`
        result += `    }),\n`
      }
    })

    result = result.slice(0, -1) // remove last line
    return result
  }

  /**
   * Print the schema into the template generator
   */
  buildCsvSchema () {
    let result = ''

    this.nonForeignAtrrs.forEach((attr) => {
      if (attr.isObjectOrigin) {
        if (attr.isObjectResource) {
          result += `    ${attr.name}: (schema) => `
        } else {
          result += `    // TODO: define the attribute\n`
          result += `    // ${attr.name}: (schema) => `
        }

        if (attr.isRequired) {
          result += `schema.model.${attr.name}.$id,\n`
        } else {
          result += `schema.model.${attr.name} && schema.model.${attr.name}.$id,\n`
        }
      } else if (attr.isArrayOrigin) {
      } else if (attr.isSoftDelete) {
        result += `    ${attr.name}: (schema) => Helper.bool(schema.model.${attr.name}),\n`
      } else if (attr.isUrl) {
        result += `    ${attr.name}: (schema) => schema.model.${attr.name},\n`
      } else if (attr.isImageUrl) {
        result += `    ${attr.name}: (schema) => schema.model.${attr.name},\n`
      } else if (attr.isBoolean) {
        result += `    ${attr.name}: (schema) => Helper.bool(schema.model.${attr.name}),\n`
      } else if (attr.isDate) {
        result += `    ${attr.name}: (schema) => Helper.date(schema.model.${attr.name}),\n`
      } else if (attr.isDatetime) {
        result += `    ${attr.name}: (schema) => Helper.datetime(schema.model.${attr.name}),\n`
      } else if (attr.isPassword) {
      } else if (attr.isPhone) {
        result += `    ${attr.name}: (schema) => Helper.phone(schema.model.${attr.name}),\n`
      } else if (attr.isCpf) {
        result += `    ${attr.name}: (schema) => Helper.cpf(schema.model.${attr.name}),\n`
      } else if (attr.isCnpj) {
        result += `    ${attr.name}: (schema) => Helper.cnpj(schema.model.${attr.name}),\n`
      } else if (attr.isRg) {
        result += `    ${attr.name}: (schema) => Helper.rg(schema.model.${attr.name}),\n`
      } else {
        result += `    ${attr.name}: (schema) => schema.model.${attr.name},\n`
      }
    })

    result = result.slice(0, -1) // remove last line
    return result
  }

  /**
   * Print the AJV
   */
  buildAjv (attr = new Attr()) {
    let result = ''

    if (attr.isString || attr.isTAG || attr.isEmail || attr.isPassword || attr.isDate || attr.isDatetime || attr.isInteger || attr.isDouble) {
      result += `      ajv: {\n`
      if (attr.isInteger) {
        if (attr.isRequired) {
          result += `        type: AjvType.requiredInteger,\n`
        } else {
          result += `        type: AjvType.integerOrNull,\n`
        }
      } else if (attr.isDouble) {
        if (attr.isRequired) {
          result += `        type: AjvType.requiredNumber,\n`
        } else {
          result += `        type: AjvType.numberOrNull,\n`
        }
      } else {
        if (attr.isRequired) {
          result += `        type: AjvType.requiredString,\n`
        } else {
          result += `        type: AjvType.stringOrNull,\n`
        }
        if (attr.isEmail) {
          result += `        format: 'email',\n`
        } else if (attr.isPhone) {
          result += `        format: 'phone',\n`
        } else if (attr.isDate) {
          result += `        format: 'date',\n`
        } else if (attr.isCpf) {
          result += `        format: 'cpf',\n`
        } else if (attr.isCnpj) {
          result += `        format: 'cnpj',\n`
        } else if (attr.isRg) {
          result += `        format: 'rg',\n`
        } else if (attr.isDatetime) {
          result += `        format: 'datetime',\n`
        } else {
          result += `        maxLength: 255,\n`
        }
      }
      result += `      },\n`
    }

    return result
  }

  /**
   * Print the locale classes into the template generator
   */
  buildLocale (prefix = '') {
    let result = ''

    result += `    ${prefix}${this.name}: {\n`
    this.attrs.forEach((attr) => {
      result += `      ${attr.name}: '${startCase(attr.name)}',\n`
    })
    result += `    },\n`

    return result
  }

  buildPersistResourceInstances () {
    let result = ''

    this.persistDependencies.forEach((dep) => {
      result += `    collection${dep.children[0]} = new ${dep.children[0]}Collection().whole()\n`
    })

    return result
  }

  buildPersistResource () {
    let result = ''

    this.objectAtrrs.forEach((attr) => {
      result += `        ${attr.name}: this.collection${attr.type}.all(),\n`
    })

    this.arrayAtrrs.forEach((attr) => {
      result += `        ${attr.name}: this.collection${attr.type}.all(),\n`
    })

    result = result.slice(0, -1) // remove last line

    return result
  }
}
