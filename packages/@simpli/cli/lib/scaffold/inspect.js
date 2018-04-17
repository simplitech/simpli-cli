const request = require('../util/request.js')
const ScaffoldSetup = require('./ScaffoldSetup')
const keyBy = require('lodash.keyby')
const chalk = require('chalk')

module.exports = async (inspectPaths = [], url, mode) => {
  const get = require('get-value')
  const stringify = require('javascript-stringify')
  const resp = await request.get(url)
  const swaggerJSON = resp.body

  const { paths, definitions } = swaggerJSON

  const scaffoldSetup = new ScaffoldSetup()
  scaffoldSetup.apiUrlDev = null
  scaffoldSetup.apiUrlProd = null
  scaffoldSetup.availableLanguages = null
  scaffoldSetup.defaultLanguage = null
  scaffoldSetup.defaultCurrency = null
  scaffoldSetup.title = null

  if (inspectPaths.length > 0) {
    scaffoldSetup.setModels(definitions, paths)
    scaffoldSetup.models = keyBy(scaffoldSetup.models, 'name')
  } else {
    scaffoldSetup.models = 'Object {/* omitted */}'
  }

  let res
  if (inspectPaths.length > 1) {
    res = {}
    inspectPaths.forEach(path => {
      res[path] = get(scaffoldSetup, path)
    })
  } else if (inspectPaths.length === 1) {
    res = get(scaffoldSetup, inspectPaths[0])
  } else {
    res = scaffoldSetup
  }

  console.log(stringify(res, (value, indent, stringify) => {
    if (typeof value === 'function' && value.toString().length > 100) {
      return `function () { /* omitted long function */ }`
    }
    return stringify(value)
  }, 2))

  if (inspectPaths.length === 0) {
    console.info(`Note: use ${chalk.yellow(`simpli inspect:scaffold models[.?]`)} to show the models`)
  }
}
