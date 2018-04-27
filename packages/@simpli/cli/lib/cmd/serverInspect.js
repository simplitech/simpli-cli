const ServerSetup = require('../server/setup/ServerSetup')
const Database = require('../server/Database')
const keyBy = require('lodash.keyby')
const chalk = require('chalk')
const clearConsole = require('../util/clearConsole')

module.exports = async (inspectPaths = []) => {
  require('dotenv').config()
  const get = require('get-value')
  const stringify = require('javascript-stringify')

  await clearConsole()

  if (inspectPaths.length === 0) {
    console.info(`Use ${chalk.yellow(`simpli server:inspect table[.?]`)}`)
    return
  }

  const serverSetup = new ServerSetup()

  const host = process.env.MYSQL_HOST
  const port = process.env.MYSQL_PORT
  const user = process.env.MYSQL_USER
  const password = process.env.MYSQL_PASSWORD
  const database = process.env.MYSQL_DATABASE

  const defaultConfig = { host, port, user, password, database }

  await Database.requestConnection(serverSetup, defaultConfig)

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
}
