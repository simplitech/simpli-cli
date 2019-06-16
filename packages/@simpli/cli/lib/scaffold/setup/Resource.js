module.exports = class Resource {
  constructor () {
    this.endpoint = null
    this.endpointParams = []
    this.keyID = null
    this.keyTAG = null
    this.deletable = null
  }

  get endpointParamsImploded () {
    let str = ''
    this.endpointParams.forEach((param) => {
      str += `/:${param}`
    })
    return str
  }

  get endpointParamsMethodImploded () {
    let str = ''
    this.endpointParams.forEach((param) => {
      str += `${param}, `
    })
    str = str.slice(0, -2)
    return str
  }

  get endpointParamsIfImploded () {
    let str = 'true'
    if (this.endpointParams.length) {
      str = ''
    }
    this.endpointParams.forEach((param) => {
      str += `${param} && `
    })
    str = str.slice(0, -4)
    return str
  }

  /**
   * Set endpoint and endpointParams values
   * @param wsEndpoint WebSever Endpoint
   */
  setEndpoint (wsEndpoint = '') {
    this.endpoint = wsEndpoint.replace(/\/{/g, '{/')

    // Populate endpointParams
    const params = /{([^}]+)}/g
    let matchParams
    do {
      matchParams = params.exec(wsEndpoint)
      if (matchParams) this.endpointParams.push(matchParams[1])
    } while (matchParams)
  }

  /**
   * Set keyID and keyTAG
   */
  setKeys (keyID, keyTAG) {
    this.keyID = keyID || null
    this.keyTAG = keyTAG || null
  }

  /**
   * Set deletable
   */
  setDeletable (val) {
    this.deletable = val
  }
}
