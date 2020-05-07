const Auth = require('./Auth')
const stringToParagraph = require('../../util/stringToParagraph')

module.exports = class Api {
  constructor (apiConfig) {
    this.name = null
    this.summary = null
    this.description = null
    this.method = null
    this.endpoint = null
    this.belongsToModel = null
    this.tags = []
    this.paths = []
    this.queries = []
    this.body = {
      name: null,
      type: null,
      required: null,
      model: null
    }
    this.respModelType = null
    this.respModel = null

    const config = apiConfig || {
      summary: null,
      description: null,
      tags: [],
      operationId: null,
      method: null,
      endpoint: null,
      parameters: [],
      responses: {}
    }

    this.name = config.operationId
    this.summary = config.summary || null
    this.description = config.description || null
    this.method = config.method
    this.endpoint = config.endpoint

    this.setTags(config)
    this.setPaths(config)
    this.setQueries(config)
    this.setBody(config)
    this.setRespModelType(config)
    this.setRespModel(config)
  }

  setTags (config) {
    this.tags = (config.tags || [])
  }

  setPaths (config) {
    this.paths = (config.parameters || [])
      .filter((param) => param.in === 'path')
      .map((param) => ({
        name: param.name,
        type: this.convertType((param.schema && param.schema.type) || param.type),
        required: Boolean(param.required)
      }))
  }

  setQueries (config) {
    this.queries = (config.parameters || [])
      .filter((param) => param.in === 'query')
      .map((param) => {
        let type = (param.schema && param.schema.type) || param.type
        const isArray = type === 'array'

        if (type === 'array') {
          type = (
            param.schema &&
            param.schema.items &&
            param.schema.items.type
          ) || null
        }

        type = this.convertType(type)

        if (isArray) {
          type = `${type}[]`
        }

        return {
          name: param.name,
          type,
          required: Boolean(param.required)
        }
      })
  }

  setBody (config) {
    // Openapi body
    let body = config.requestBody && config.requestBody.content[Object.keys(config.requestBody.content)[0]]

    if (!body) {
      // Swagger body
      body = (config.parameters || []).find((param) => param.in === 'body')
    }

    if (body) {
      this.body.name = body.name || 'body'
      this.body.required = Boolean((config.requestBody && config.requestBody.required) || body.required)
      if (body.schema && body.schema.type === 'array') {
        this.body.type = 'array'
        this.body.model = (
          body.schema &&
          body.schema.items &&
          body.schema.items.$ref &&
          body.schema.items.$ref.match(/[^\/]+(?=\/$|$)/)[0]
        ) || null
      } else {
        this.body.type = 'object'
        this.body.model = (body.schema && body.schema.$ref && body.schema.$ref.match(/[^\/]+(?=\/$|$)/)[0]) || null
      }
    }
  }

  setRespModelType (config) {
    const content = config.responses && config.responses['default'] && config.responses['default'].content
    // Openapi schema
    let schema = content && content[Object.keys(content)[0]] && content[Object.keys(content)[0]].schema

    if (!schema) {
      // Swagger schema
      schema = config.responses && config.responses['200'] && config.responses['200'].schema
    }

    if (schema && schema.$ref) {
      this.respModelType = schema && schema.type || 'object'
    } else {
      this.respModelType = schema && schema.type || null
    }
  }

  setRespModel (config) {
    const content = config.responses && config.responses['default'] && config.responses['default'].content
    // Openapi schema
    let schema = content && content[Object.keys(content)[0]] && content[Object.keys(content)[0]].schema

    if (!schema) {
      // Swagger schema
      schema = config.responses && config.responses['200'] && config.responses['200'].schema
    }

    if (this.respModelType === 'array') {
      this.respModel = (
        schema &&
        schema.items &&
        schema.items.$ref &&
        schema.items.$ref.match(/[^\/]+(?=\/$|$)/)[0]
      ) || null
    } else {
      this.respModel = (schema && schema.$ref && schema.$ref.match(/[^\/]+(?=\/$|$)/)[0]) || null
    }
    if ((this.respModel || '').match(/^(PageCollection)\w+$/)) {
      this.respModel = `${this.respModel.replace(/^PageCollection/, '')}Collection`
    }
  }

  hasTag (name = '') {
    return !!this.tags.find((tag) => (tag || '').toLowerCase() === name.toLowerCase())
  }

  get isBodyThis () {
    if (this.body.model && this.belongsToModel) {
      return this.body.model === this.belongsToModel
    }
    return false
  }

  get isRespThis () {
    if (this.respModelType === 'object' && this.belongsToModel) {
      return this.respModel === this.belongsToModel
    }
    return false
  }

  get methodUppercase () {
    return (this.method || '').toUpperCase()
  }

  get methodLowercase () {
    return (this.method || '').toLowerCase()
  }

  get moduleName () {
    const match = this.endpoint.match(/^\/([A-Za-z0-9_-]+)\/\S*$/)
    return match ? match[1] : ''
  }

  isSignIn (auth = new Auth()) {
    if (auth.model.loginHolder === null) {
      return false
    }
    return this.body.model === auth.model.loginHolder.name
  }

  isRecoverPasswordByMail (auth = new Auth()) {
    if (auth.model.recoverPasswordByMailRequest === null) {
      return false
    }
    return this.body.model === auth.model.recoverPasswordByMailRequest.name
  }

  isResetPassword (auth = new Auth()) {
    if (auth.model.resetPasswordRequest === null) {
      return false
    }
    return this.body.model === auth.model.resetPasswordRequest.name
  }

  isChangePassword (auth = new Auth()) {
    if (auth.model.changePasswordRequest === null) {
      return false
    }
    return this.body.model === auth.model.changePasswordRequest.name
  }

  convertType (type = '') {
    if (type === 'integer' || type === 'double' || type === 'number') return 'number'
    if (type === 'boolean') return 'boolean'
    return 'string'
  }

  get stringfyAttrs () {
    const list = []

    this.paths.forEach((path) => {
      if (path && path.name === 'id' && (this.methodUppercase === 'PUT' || this.methodUppercase === 'DELETE')) {
      } else {
        list.push(path)
      }
    })

    if (this.body.model && !this.isBodyThis) {
      list.push({
        name: 'body',
        required: true,
        type: this.body.model
      })
    }

    if (this.queries.length) {
      list.push({
        name: 'params',
        required: true,
        type: 'any'
      })
    }

    const result = list.map((item) => `${item.name + (item.required ? '' : '?')}: ${item.type}`)
    return result.join(', ')
  }

  get stringfyCollectionAttrs () {
    const result = [...this.paths].map((item) => `${item.name + (item.required ? '' : '?')}: ${item.type}`)
    return result.join(', ')
  }

  get stringfyParams () {
    return this.queries.map((query) => query.name).join(', ')
  }

  get stringfyAttrsWithModel () {
    const stringfyBody = this.stringfyBody
    if (stringfyBody) return [stringfyBody, ...this.stringfyAttrs.split(', ')].join(', ')
    return this.stringfyAttrs
  }

  get stringfyBody () {
    if (this.body.model) {
      return `model${this.body.required ? '' : '?'}: ${this.body.model + (this.body.type === 'array' ? '[]' : '')}`
    }
    return ''
  }

  get stringfyEndpoint () {
    let endpoint = `${this.endpoint}`
    const pattern = /{\w+}/g
    const match = endpoint.match(pattern)
    if (match) {
      match.forEach((path) => {
        if (path === '{id}' && (this.methodUppercase === 'PUT' || this.methodUppercase === 'DELETE')) {
          endpoint = endpoint.replace(path, `\${this.$id}`)
        } else {
          endpoint = endpoint.replace(path, `\$${path}`)
        }
      })
    }
    return endpoint
  }

  /**
   * Print this api into the template generator
   */
  build (auth = new Auth()) {
    // Find the reserved APIs...
    if (this.isSignIn(auth)) return this.buildSignIn(auth)
    if (this.isRecoverPasswordByMail(auth)) return this.buildRecoverPasswordByMail()
    if (this.isResetPassword(auth)) return this.buildResetPassword()
    if (this.isChangePassword(auth)) return this.buildChangePassword()
    // ...Or use the standard method
    else return this.buildMethod()
  }

  /**
   * Print this api into the template generator
   */
  buildInCollection () {
    let result = ''

    result += `  async ${this.name}(${this.stringfyCollectionAttrs}) {\n`
    result += `    return await Request.${this.methodLowercase}(\`${this.stringfyEndpoint}\`, {params: this.params})\n`
    result += `      .name('${this.name}')\n`
    result += `      .as(this)\n`
    result += `      .getResponse()\n`
    result += `  }\n`

    return result
  }

  /**
   * Reserved API print
   */
  buildMethod (before, bodyRequest, delay = 0) {
    let result = ''
    const summary = stringToParagraph(this.summary, 15, '   * ')
    const description = stringToParagraph(this.description, 15, '   * ')

    if (summary || description) {
      result += `  /**\n`
      result += `   * ${summary || description}\n`
      if (summary && description) {
        result += `   * \n`
        result += `   * ${description}\n`
      }
      result += `   */\n`
    }

    let staticKey = ''
    if (!bodyRequest && !this.isRespThis && !this.isBodyThis && this.respModelType === 'object') {
      staticKey = 'static '
    }

    result += `  ${staticKey}async ${this.name}(${this.stringfyAttrs}) {\n`
    const params = this.queries.length ? ', {params}' : ''
    let body = bodyRequest ? `, ${bodyRequest}` : null
    if (!body) {
      body = this.body.model ? (this.isBodyThis ? ', this' : `, ${this.body.model}`) : ''
    }

    result += before || ''

    result += `    return await Request.${this.methodLowercase}(\`${this.stringfyEndpoint}\`${body}${params})\n`
    result += `      .name('${this.name}')\n`

    if (delay) {
      result += `      .delay(${delay})\n`
    }

    if (this.respModelType === 'object') {
      if (this.isRespThis) {
        result += `      .as(this)\n`
      } else {
        result += `      .as(${this.respModel})\n`
      }
    } else if (this.respModelType === 'array') {
      result += `      .asArrayOf(${this.respModel})\n`
    } else if (this.respModelType === 'integer') {
      result += `      .asNumber()\n`
    } else if (this.respModelType === 'string') {
      result += `      .asString()\n`
    } else {
      result += `      .asAny()\n`
    }
    result += `      .getData()\n`
    result += `  }\n`

    return result
  }

  /**
   * Reserved API print
   */
  buildSignIn (auth = new Auth()) {
    let result = ''

    result += `    const request = $.utils.clone(this)\n`
    result += `    request.${auth.passwordAttrName} = $.utils.sha256(this.${auth.passwordAttrName})\n\n`

    return this.buildMethod(result, 'request', 1000)
  }

  /**
   * Reserved API print
   */
  buildRecoverPasswordByMail () {
    return this.buildMethod('')
  }

  /**
   * Reserved API print
   */
  buildResetPassword () {
    let result = ''

    result += `    const request = $.utils.clone(this)\n`
    result += `    request.newPassword = $.utils.sha256(this.newPassword)\n`
    result += `    request.confirmPassword = $.utils.sha256(this.confirmPassword)\n\n`

    return this.buildMethod(result, 'request')
  }

  /**
   * Reserved API print
   */
  buildChangePassword () {
    let result = ''

    result += `    const request = $.utils.clone(this)\n`
    result += `    request.currentPassword = $.utils.sha256(this.currentPassword)\n`
    result += `    request.newPassword = $.utils.sha256(this.newPassword)\n`
    result += `    request.confirmPassword = $.utils.sha256(this.confirmPassword)\n\n`

    return this.buildMethod(result, 'request')
  }
}
