const Auth = require('./Auth')

module.exports = class Api {
  constructor (apiConfig) {
    this.name = null
    this.method = null
    this.endpoint = null
    this.tags = []
    this.paths = []
    this.queries = []
    this.body = {
      name: null,
      type: null,
      required: null,
      model: null
    }
    this.respModel = null

    const config = apiConfig || {
      tags: [],
      operationId: null,
      method: null,
      endpoint: null,
      parameters: [],
      responses: {}
    }

    this.name = config.operationId
    this.method = config.method
    this.endpoint = config.endpoint

    this.setTags(config)
    this.setPaths(config)
    this.setQueries(config)
    this.setBody(config)
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
        type: this.convertType(param.type),
        required: param.required
      }))
  }

  setQueries (config) {
    this.queries = (config.parameters || [])
      .filter((param) => param.in === 'query')
      .map((param) => ({
        name: param.name,
        type: this.convertType(param.type),
        required: param.required
      }))
  }

  setBody (config) {
    const body = config.parameters.find((param) => param.in === 'body')

    if (body) {
      this.body.name = body.name
      this.body.required = body.required
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

  setRespModel (config) {
    const schema = config.responses && config.responses['200'] && config.responses['200'].schema
    this.respModel = (schema && schema.$ref && schema.$ref.match(/[^\/]+(?=\/$|$)/)[0]) || null
  }

  hasTag (name = '') {
    return !!this.tags.find((tag) => (tag || '').toLowerCase() === name.toLowerCase())
  }

  get methodUppercase () {
    return (this.method || '').toUpperCase()
  }

  isSignIn (auth = new Auth()) {
    if (auth.model.loginHolder === null) {
      return false
    }
    return this.body.model === auth.model.loginHolder.name
  }

  isResetPassword (auth = new Auth()) {
    if (auth.model.resetPasswordRequest === null) {
      return false
    }
    return this.body.model === auth.model.resetPasswordRequest.name
  }

  isRecoverPassword (auth = new Auth()) {
    if (auth.model.recoverPasswordRequest === null) {
      return false
    }
    return this.body.model === auth.model.recoverPasswordRequest.name
  }

  isChangePassword (auth = new Auth()) {
    if (auth.model.changePasswordRequest === null) {
      return false
    }
    return this.body.model === auth.model.changePasswordRequest.name
  }

  convertType (type = '') {
    if (type === 'integer' || type === 'double') return 'number'
    if (type === 'boolean') return 'boolean'
    return 'string'
  }

  get stringfyAttrs () {
    const method = (this.method || '').toUpperCase()
    let list = []

    if (method === 'GET' || method === 'DELETE') {
      list = [...this.paths, ...this.queries]
    } else if (method === 'POST' || method === 'PUT') {
      list = [...this.paths]
    }

    const result = list.map((item) => `${item.name + (item.required ? '' : '?')}: ${item.type}`)
    result.push(`spinner = '${this.name}'`)

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
        endpoint = endpoint.replace(path, `\$${path}`)
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
    if (this.isResetPassword(auth)) return this.buildResetPassword()
    if (this.isRecoverPassword(auth)) return this.buildRecoverPassword()
    if (this.isChangePassword(auth)) return this.buildChangePassword()
    // ...Or use the standard methods
    if (this.methodUppercase === 'GET') return this.buildGetOrDeleteMethod()
    if (this.methodUppercase === 'POST') return this.buildPostOrPutMethod()
    if (this.methodUppercase === 'PUT') return this.buildPostOrPutMethod()
    if (this.methodUppercase === 'DELETE') return this.buildGetOrDeleteMethod()
  }

  /**
   * Reserved API print
   */
  buildGetOrDeleteMethod () {
    let result = ''

    result += `  async ${this.name}(${this.stringfyAttrs}) {\n`
    if (this.queries.length) result += `    const params = {${this.stringfyParams}}\n`
    result += `    const fetch = async () => await this.${this.methodUppercase}(\`${this.stringfyEndpoint}\`${this.queries.length ? ', {params}' : ''})\n`
    result += `    return await $.await.run(fetch, spinner)\n`
    result += `  }\n`

    return result
  }

  /**
   * Reserved API print
   */
  buildPostOrPutMethod () {
    let result = ''

    result += `  async ${this.name}(${this.stringfyAttrsWithModel}) {\n`
    result += `    const fetch = async () => {\n`
    if (this.body.model && this.body.type !== 'array') {
      if (this.body.required) {
        result += `      await model.validate()\n`
      } else {
        result += `      if (model) await model.validate()\n`
      }
    }
    result += `      return await this.${this.methodUppercase}(\`${this.stringfyEndpoint}\`${this.body.model ? ', model' : ''})\n`
    result += `    }\n\n`
    result += `    return await $.await.run(fetch, spinner)\n`
    result += `  }\n`

    return result
  }

  /**
   * Reserved API print
   */
  buildSignIn (auth = new Auth()) {
    let result = ''

    result += `  async ${this.name}(request: ${this.body.model}, spinner = '${this.name}', delay = 1000) {\n`
    result += `    const model = new ${this.body.model}()\n\n`

    result += `    model.${auth.accountAttrName} = request.${auth.accountAttrName}\n`
    result += `    model.${auth.passwordAttrName} = encrypt(request.${auth.passwordAttrName} || '')\n\n`

    result += `    const fetch = async () => {\n`
    result += `      await model.validate()\n`
    result += `      return await this.${this.methodUppercase}(\`${this.stringfyEndpoint}\`, model)\n`
    result += `    }\n\n`

    result += `    return await $.await.run(fetch, spinner, delay)\n`
    result += `  }\n`

    return result
  }

  /**
   * Reserved API print
   */
  buildResetPassword () {
    let result = ''

    result += `  async ${this.name}(request: ${this.body.model}, spinner = '${this.name}', delay = 1000) {\n`
    result += `    const fetch = async () => {\n`
    result += `      await request.validate()\n`
    result += `      return await this.${this.methodUppercase}(\`${this.stringfyEndpoint}\`, request)\n`
    result += `    }\n\n`

    result += `    return await $.await.run(fetch, spinner, delay)\n`
    result += `  }\n`

    return result
  }

  /**
   * Reserved API print
   */
  buildRecoverPassword () {
    let result = ''

    result += `  async ${this.name}(request: ${this.body.model}, spinner = '${this.name}', delay = 1000) {\n`
    result += `    const model = new ${this.body.model}()\n\n`

    result += `    model.newPassword = encrypt(request.newPassword || '')\n`
    result += `    model.confirmPassword = encrypt(request.confirmPassword || '')\n\n`

    result += `    const fetch = async () => {\n`
    result += `      await request.validate()\n`
    result += `      return await this.${this.methodUppercase}(\`${this.stringfyEndpoint}\`, request)\n`
    result += `    }\n\n`

    result += `    return await $.await.run(fetch, spinner, delay)\n`
    result += `  }\n`

    return result
  }

  /**
   * Reserved API print
   */
  buildChangePassword () {
    let result = ''

    result += `  async ${this.name}(request: ${this.body.model}, spinner = '${this.name}', delay = 1000) {\n`
    result += `    const model = new ${this.body.model}()\n\n`

    result += `    model.currentPassword = encrypt(request.currentPassword || '')\n`
    result += `    model.newPassword = encrypt(request.newPassword || '')\n\n`

    result += `    const fetch = async () => {\n`
    result += `      await request.validate()\n`
    result += `      return await this.${this.methodUppercase}(\`${this.stringfyEndpoint}\`, request)\n`
    result += `    }\n\n`

    result += `    return await $.await.run(fetch, spinner, delay)\n`
    result += `  }\n`

    return result
  }
}
