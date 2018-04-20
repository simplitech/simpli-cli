const request = require('../util/request.js')
const ScaffoldSetup = require('./ScaffoldSetup')
const keyBy = require('lodash.keyby')
const chalk = require('chalk')

module.exports = async (url, inspectPaths = []) => {
  const get = require('get-value')
  const stringify = require('javascript-stringify')
  const resp = await request.get(url)
  const swaggerJSON = resp.body

  const { paths, definitions } = swaggerJSON

  const scaffoldSetup = new ScaffoldSetup()
  const swagger = {
    api: null,
    model: null
  }

  if (inspectPaths.length > 0) {
    scaffoldSetup.injectSwagger(definitions, paths)
    swagger.api = keyBy(scaffoldSetup.apis, 'name')
    swagger.model = keyBy(scaffoldSetup.models, 'name')
  } else {
    console.info(`Use ${chalk.yellow(`simpli inspect:swagger <swagger-url> api[.?]`)} or ${chalk.yellow(`simpli inspect:swagger <swagger-url> model[.?]`)}`)
    return
  }

  let res
  if (inspectPaths.length > 1) {
    res = {}
    inspectPaths.forEach(path => {
      res[path] = get(swagger, path)
    })
  } else if (inspectPaths.length === 1) {
    res = get(swagger, inspectPaths[0])
  } else {
    res = swagger
  }

  console.log(stringify(res, (value, indent, stringify) => {
    if (typeof value === 'function' && value.toString().length > 100) {
      return `function () { /* omitted long function */ }`
    }
    return stringify(value)
  }, 2))
}
