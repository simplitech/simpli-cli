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

  /**
   * Set endpoint and endpointParams values
   * @param wsEndpoint WebSever Endpoint
   */
  setEndpoint (wsEndpoint) {
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
