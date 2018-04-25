const Dependence = require('./Dependence')
const camelCase = require('lodash.camelcase')

module.exports = class Auth {
  constructor () {
    this.api = {
      signIn: null,
      auth: null
    }
    this.model = {
      loginHolder: null,
      loginResp: null
    }
    this.dependencies = []
  }

  /**
   * Only resolved dependencies
   */
  get resolvedDependencies () {
    return this.dependencies.filter((dep) => dep.resolved)
  }

  /**
   * Only non-resolved dependencies
   */
  get notResolvedDependencies () {
    return this.dependencies.filter((dep) => !dep.resolved)
  }

  setDependencies () {
    if (!this.model.loginResp) return
    const dependencies = []

    this.model.loginResp.objectAtrrs.forEach((attr) => {
      const modelResource = new Dependence(attr.type, true, false)
      modelResource.resolved = false
      modelResource.addChild(attr.type)
      if (attr.type !== this.model.loginResp.name) dependencies.push(modelResource)
    })

    this.model.loginResp.arrayAtrrs.forEach((attr) => {
      const modelResource = new Dependence(attr.type, true, false)
      modelResource.resolved = false
      modelResource.addChild(attr.type)
      if (attr.type !== this.model.loginResp.name) dependencies.push(modelResource)
    })

    this.dependencies = dependencies
  }

  buildType () {
    let result = ''
    if (!this.model.loginResp) return result

    this.model.loginResp.attrs.forEach((attr) => {
      if (attr.isPrimaryOrigin) {
        result += `  ${attr.name}?: ${attr.typeBuild},\n`
      } else if (attr.isObjectOrigin) {
        result += `  ${attr.name}: ${attr.typeBuild},\n`
      } else if (attr.isArrayOrigin) {
        result += `  ${attr.name}: ${attr.typeBuild},\n`
      }
    })

    return result
  }

  buildExport () {
    let result = ''
    if (!this.model.loginResp) return result

    if (!this.model.loginResp.attrs.find((attr) => attr.name === 'token')) {
      result += `export const getToken = () => store.getters['auth/token']\n`
    }

    this.model.loginResp.attrs.forEach((attr) => {
      result += `export const ${camelCase('get-' + attr.name)} = () `
      result += `=> store.getters['auth/${attr.name}']\n`
    })

    return result
  }

  buildState () {
    let result = ''
    if (!this.model.loginResp) return result

    this.model.loginResp.attrs.forEach((attr) => {
      if (attr.isPrimaryOrigin) {
        result += `  ${attr.name}: undefined,\n`
      } else if (attr.isObjectOrigin) {
        result += `  ${attr.name}: new ${attr.type}(),\n`
      } else if (attr.isArrayOrigin) {
        result += `  ${attr.name}: [],\n`
      }
    })

    return result
  }

  buildGetter () {
    let result = ''
    if (!this.model.loginResp) return result

    if (!this.model.loginResp.attrs.find((attr) => attr.name === 'token')) {
      result += `  token: ({token}) => '',\n`
    }

    this.model.loginResp.attrs.forEach((attr) => {
      result += `  ${attr.name}: ({${attr.name}}) => ${attr.name},\n`
    })

    return result
  }

  buildPasswordEncrypt () {
    let result = ''
    if (!this.model.loginHolder) return result

    this.model.loginHolder.attrs.forEach((attr) => {
      if (attr.isPassword) {
        result += `    model.${attr.name} = encrypt(model.${attr.name} || '')\n`
      }
    })

    return result
  }

  buildSetItem (objName) {
    let result = ''
    if (!this.model.loginResp) return result

    this.model.loginResp.attrs.forEach((attr) => {
      const asString = (attr.isID || attr.isInteger || attr.isDouble) ? ' as string' : ''
      if (attr.isPrimaryOrigin) {
        result += `    if (${objName}.${attr.name}) `
        result += `localStorage.setItem('${attr.name}', ${objName}.${attr.name + asString})\n`
      } else if (attr.isObjectOrigin) {
        result += `    if (${objName}.${attr.name}) `
        result += `localStorage.setItem('${attr.name}', JSON.stringify(${objName}.${attr.name}))\n`
      }
    })

    return result
  }

  buildGetItem () {
    let result = ''
    if (!this.model.loginResp) return result

    this.model.loginResp.attrs.forEach((attr) => {
      if (attr.isPrimaryOrigin) {
        result += `    const ${attr.name} = localStorage.getItem('${attr.name}')!\n`
      } else if (attr.isObjectOrigin) {
        result += `    const ${attr.name} = JSON.parse(localStorage.getItem('${attr.name}')!)\n`
      }
    })

    return result
  }

  buildRemoveItem () {
    let result = ''
    if (!this.model.loginResp) return result

    this.model.loginResp.attrs.forEach((attr) => {
      result += `    localStorage.removeItem('${attr.name}')\n`
    })

    return result
  }

  buildPopulate () {
    let result = ''
    if (!this.model.loginResp) return result

    this.model.loginResp.attrs.forEach((attr) => {
      result += `    state.${attr.name} = ${attr.name}\n`
    })

    return result
  }

  buildForget () {
    let result = ''
    if (!this.model.loginResp) return result

    this.model.loginResp.attrs.forEach((attr) => {
      if (attr.isPrimaryOrigin) {
        result += `    state.${attr.name} = undefined\n`
      } else if (attr.isObjectOrigin) {
        result += `    state.${attr.name} = new ${attr.type}()\n`
      }
    })

    return result
  }
}
