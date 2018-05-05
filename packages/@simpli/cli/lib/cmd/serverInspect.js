const ServerSetup = require('../server/setup/ServerSetup')
const Database = require('../server/Database')
const keyBy = require('lodash.keyby')
const chalk = require('chalk')
const clearConsole = require('../util/clearConsole')
const contextConnection = require('../server/util/contextConnection')

module.exports = async (inspectPaths = []) => {
  require('dotenv').config()
  const get = require('get-value')
  const stringify = require('javascript-stringify')

  await clearConsole()

  if (inspectPaths.length === 0) {
    console.info(`Use ${chalk.yellow(`simpli server:inspect table[.?]`)}`)
    return
  }

  await contextConnection(async (connection) => {
    const serverSetup = new ServerSetup()
    await Database.requestConnection(serverSetup, connection)

    const db = {
      table: keyBy(serverSetup.tables, 'name')
    }

    let res
    if (inspectPaths.length > 1) {
      res = {}
      inspectPaths.forEach(path => {
        res[path] = get(db, path)
      })
    } else if (inspectPaths.length === 1) {
      res = get(db, inspectPaths[0])
    } else {
      res = db
    }

    console.log(stringify(res, (value, indent, stringify) => {
      if (typeof value === 'function' && value.toString().length > 100) {
        return `function () { /* omitted long function */ }`
      }
      return stringify(value)
    }, 2))
  })
}
