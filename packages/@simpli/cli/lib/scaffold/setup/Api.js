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
    this.tags = config.tags
  }

  setPaths (config) {
    this.paths = config.parameters
      .filter((param) => param.in === 'path')
      .map((param) => ({
        name: param.name,
        type: this.convertType(param.type),
        required: param.required
      }))
  }

  setQueries (config) {
    this.queries = config.parameters
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

    return list.map((item) => `${item.name + (item.required ? '' : '?')}: ${item.type}`).join(', ')
  }

  get stringfyParams () {
    return this.queries.map((query) => query.name).join(', ')
  }

  get stringfyAttrsWithModel () {
    return this.stringfyAttrs + (this.paths.length && this.body.model ? ', ' : '') + this.stringfyBody
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
  build () {
    let result = ''
    const method = (this.method || '').toUpperCase()

    if (method === 'GET') {
      result += `  async ${this.name}(${this.stringfyAttrs}) {\n`
      if (this.queries.length) result += `    const params = {${this.stringfyParams}}\n`
      result += `    return await this.GET(\`${this.stringfyEndpoint}\`${this.queries.length ? ', {params}' : ''})\n`
      result += `  }\n`
    } else if (method === 'POST') {
      result += `  async ${this.name}(${this.stringfyAttrsWithModel}) {\n`
      result += `    return await this.POST(\`${this.stringfyEndpoint}\`${this.body.model ? ', model' : ''})\n`
      result += `  }\n`
    } else if (method === 'PUT') {
      result += `  async ${this.name}(${this.stringfyAttrsWithModel}) {\n`
      result += `    return await this.PUT(\`${this.stringfyEndpoint}\`${this.body.model ? ', model' : ''})\n`
      result += `  }\n`
    } else if (method === 'DELETE') {
      result += `  async ${this.name}(${this.stringfyAttrs}) {\n`
      if (this.queries.length) result += `    const params = {${this.stringfyParams}}\n`
      result += `    return await this.DELETE(\`${this.stringfyEndpoint}\`${this.queries.length ? ', {params}' : ''})\n`
      result += `  }\n`
    }
    return result
  }
}
