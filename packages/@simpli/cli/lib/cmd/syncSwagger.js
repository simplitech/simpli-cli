// const fs = require('fs')
const path = require('path')
const clearConsole = require('../util/clearConsole')
const inquirer = require('inquirer')
const { error, stopSpinner } = require('@vue/cli-shared-utils')
const Scaffold = require('../scaffold/Scaffold')
const execa = require('execa')

async function sync () {
  require('dotenv').config()

  const appName = process.env.VUE_APP_NAME
  const targetDir = path.resolve('./')

  let swaggerUrl = process.env.SWAGGER_URL

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

  if (!swaggerUrl || !appName) {
    if (!appName) {
      error('The current directory is not the root of a simpli frontend project')
      process.exit(1)
    }

    await clearConsole()

    const { confirm } = await inquirer.prompt([
      {
        name: 'confirm',
        type: 'confirm',
        message: 'The current project does not have swagger. Do you want to specify one?'
      }
    ])

    if (!confirm) {
      process.exit(1)
    }

    const { url } = await inquirer.prompt([
      {
        name: 'url',
        type: 'input',
        message: 'Enter swagger.json URL'
      }
    ])

    swaggerUrl = url
  }

  await clearConsole()
  const scaffold = new Scaffold(appName, targetDir, [])
  await scaffold.syncModels(swaggerUrl)
}

module.exports = (...args) => {
  sync(...args).catch(err => {
    stopSpinner(false) // do not persist
    error(err)
    process.exit(1)
  })
}
