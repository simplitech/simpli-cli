module.exports = class Api {
  constructor (apiConfig) {
    this.name = null
    this.method = null
    this.endpoint = null
    this.bodyModel = null
    this.respModel = null

    const config = apiConfig || {
      operationId: null,
      method: null,
      endpoint: null,
      parameters: [],
      responses: {}
    }

    this.name = config.operationId
    this.method = config.method
    this.endpoint = config.endpoint

    const param = config.parameters.find((param) => param.name === 'body')

    if (param) {
      this.bodyModel = param.schema && param.schema.$ref && param.schema.$ref.match(/[^\/]+(?=\/$|$)/)[0]
    }

    const schema = config.responses && config.responses['200'] && config.responses['200'].schema
    this.respModel = schema && schema.$ref && schema.$ref.match(/[^\/]+(?=\/$|$)/)[0] || null
  }

  /**
   * Print this api into the template generator
   */
  build () {
    let result = ''
    const method = (this.method || '').toUpperCase()
    if (method === 'GET') {
      result += `  async ${this.name}() {\n`
      result += `    return await this.GET('${this.endpoint}')\n`
      result += `  }\n\n`
    } else if (method === 'POST') {
      result += `  async ${this.name}(model: ${this.bodyModel}) {\n`
      result += `    return await this.POST('${this.endpoint}', model)\n`
      result += `  }\n\n`
    }
    return result
  }
}
