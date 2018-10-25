/* eslint-disable handle-callback-err */
const fs = require('fs')
const path = require('path')
const execa = require('execa')
const clearConsole = require('../util/clearConsole')
const { error, stopSpinner } = require('@vue/cli-shared-utils')
const Server = require('../server/Server')
const contextConnection = require('../server/util/contextConnection')

async function sync (options) {
  const targetDir = path.resolve('./')
  const pom = path.resolve('./pom.xml')

  const run = (command, args) => {
    if (!args) { [command, ...args] = command.split(/\s+/) }
    return execa(command, args, { cwd: targetDir })
  }

  try {
    const hasFilesToCommit = await run('git status --porcelain')
    if (hasFilesToCommit.stdout) {
      error('This project has files to commit. Commit them to proceed.')
      process.exit(1)
    }
  } catch (e) {
    error('Git hasn\'t initialized')
    process.exit(1)
  }

  if (!fs.existsSync(pom)) {
    error('The current directory is not the root of a simpli backend project')
    process.exit(1)
  }

  await clearConsole()

  await contextConnection(async (connection) => {
    const server = new Server(null, targetDir, [])
    await server.syncModels(connection, options)
  })
}

module.exports = (...args) => {
  sync(...args).catch(err => {
    stopSpinner(false) // do not persist
    error(err)
    process.exit(1)
  })
}
