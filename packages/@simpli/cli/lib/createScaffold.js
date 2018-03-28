// const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const rimraf = require('rimraf')
const inquirer = require('inquirer')
const clearConsole = require('./util/clearConsole')
const { error, stopSpinner } = require('@vue/cli-shared-utils')

async function create (projectName, options) {
  const inCurrent = projectName === '.'
  const name = inCurrent ? path.relative('../', process.cwd()) : projectName
  const targetDir = path.resolve(projectName || '.')

  await clearConsole(true)
  if (inCurrent) {
    const { ok } = await inquirer.prompt([
      {
        name: 'ok',
        type: 'confirm',
        message: `Generate project in current directory?`
      }
    ])
    if (!ok) {
      return
    }
  } else {
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: `Target directory ${chalk.cyan(targetDir)} already exists. Pick an action:`,
        choices: [
          { name: 'Overwrite', value: 'overwrite' },
          { name: 'Merge', value: 'merge' },
          { name: 'Cancel', value: false }
        ]
      }
    ])
    if (!action) {
      return
    } else if (action === 'overwrite') {
      rimraf.sync(targetDir)
    }
  }

  console.log(name)
  console.log(targetDir)
}

module.exports = (...args) => {
  create(...args).catch(err => {
    stopSpinner(false) // do not persist
    error(err)
    process.exit(1)
  })
}
