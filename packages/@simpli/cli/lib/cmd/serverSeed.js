const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const clearConsole = require('../util/clearConsole')
const { error, stopSpinner } = require('@vue/cli-shared-utils')
const Database = require('../server/Database')
const contextConnection = require('../server/util/contextConnection')

async function serverSeed (options) {
  const pom = path.resolve('./pom.xml')
  const createPath = path.resolve('./src/test/resources/database/create.sql')
  const dataPath = path.resolve('./src/test/resources/database/data.sql')

  if (!fs.existsSync(pom)) {
    error('The current directory is not the root of a simpli backend project')
    process.exit(1)
  }

  if (!fs.existsSync(createPath)) {
    error(`The file create.sql was not found. Run ${chalk.yellow('simpli new:seed')} to create it`)
    process.exit(1)
  }

  if (!fs.existsSync(dataPath)) {
    error(`The file data.sql was not found. Run ${chalk.yellow('simpli new:seed')} to create one`)
    process.exit(1)
  }

  await clearConsole()

  await contextConnection(async (connection) => {
    await Database.seedDatabase(createPath, dataPath, connection, options.force)
  })
}

module.exports = (...args) => {
  serverSeed(...args).catch(err => {
    stopSpinner(false) // do not persist
    error(err)
    process.exit(1)
  })
}
