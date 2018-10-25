const fs = require('fs')
const path = require('path')
const clearConsole = require('../util/clearConsole')
const { error, stopSpinner } = require('@vue/cli-shared-utils')
const Server = require('../server/Server')
const contextConnection = require('../server/util/contextConnection')

async function newSeed (options) {
  const targetDir = path.resolve('./')
  const pom = path.resolve('./pom.xml')

  if (!fs.existsSync(pom)) {
    error('The current directory is not the root of a simpli backend project')
    process.exit(1)
  }

  await clearConsole()

  await contextConnection(async (connection) => {
    const server = new Server(null, targetDir, [])
    await server.newSeed(connection, options)
  })
}

module.exports = (...args) => {
  newSeed(...args).catch(err => {
    stopSpinner(false) // do not persist
    error(err)
    process.exit(1)
  })
}
