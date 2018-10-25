const request = require('../util/request.js')
const ScaffoldSetup = require('../scaffold/setup/ScaffoldSetup')
const keyBy = require('lodash.keyby')
const chalk = require('chalk')
const inquirer = require('inquirer')
const { error } = require('@vue/cli-shared-utils')
const clearConsole = require('../util/clearConsole')

module.exports = async (inspectPaths = [], options) => {
  require('dotenv').config()
  const get = require('get-value')
  const stringify = require('javascript-stringify')

  await clearConsole()

  let swaggerUrl = process.env.SWAGGER_URL
  if (!swaggerUrl) {
    const { url } = await inquirer.prompt([
      {
        name: 'url',
        type: 'input',
        message: 'Enter swagger.json URL'
      }
    ])

    swaggerUrl = url
  }

  let swaggerJSON
  try {
    const resp = await request.get(swaggerUrl)
    swaggerJSON = resp.body
  } catch (e) {
    error(e.message)
    process.exit(1)
  }

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
    console.info(`Use ${chalk.yellow(`simpli scaffold:inspect api[.?]`)} or ${chalk.yellow(`simpli scaffold:inspect model[.?]`)}`)
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
