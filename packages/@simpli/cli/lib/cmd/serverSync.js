/* eslint-disable handle-callback-err */
const fs = require('fs')
const path = require('path')
const clearConsole = require('../util/clearConsole')
const inquirer = require('inquirer')
const { error, stopSpinner } = require('@vue/cli-shared-utils')
const Server = require('../server/Server')
const execa = require('execa')
const xml2js = require('xml2js')

async function sync () {
  require('dotenv').config()

  const serverName = process.env.SERVER_NAME
  const moduleName = process.env.MODULE_NAME
  const packageAddress = process.env.PACKAGE_ADDRESS

  const targetDir = path.resolve('./')
  const pom = path.resolve('./pom.xml')
  const context = path.resolve('./src/main/webapp/META-INF/context.xml')
  const parser = new xml2js.Parser()

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

  let serverConfig = { serverName, moduleName, packageAddress }
  if (!serverName || !moduleName || !packageAddress) {
    const { confirm } = await inquirer.prompt([
      {
        name: 'confirm',
        type: 'confirm',
        message: 'Can\'t find the server config. Do you want to define the configuration?'
      }
    ])

    if (!confirm) {
      process.exit(1)
    }

    serverConfig = null
  }

  const injectData = (data, connection) => {
    const url = data.url
    const pattern = /^(?:\w+:)*(?:mysql:\/\/)(\w+):(\d+)\/(\w+)$/g
    const match = pattern.exec(url)
    if (match) {
      connection.host = match[1]
      connection.port = match[2]
      connection.database = match[3]
      connection.user = data.username
      connection.password = data.password
    }
  }

  const connection = {
    host: null,
    port: null,
    user: null,
    password: null,
    database: null
  }

  await fs.readFile(context, async (err, data) => {
    await parser.parseString(data, async (err, result) => {
      let dataContext = {}
      try {
        dataContext = result.Context.Resource[0].$ || {}
      } catch (e) {}

      await clearConsole()
      injectData(dataContext, connection)

      const server = new Server(null, targetDir, [])
      await server.syncModels(connection, serverConfig)
    })
  })
}

module.exports = (...args) => {
  sync(...args).catch(err => {
    stopSpinner(false) // do not persist
    error(err)
    process.exit(1)
  })
}
