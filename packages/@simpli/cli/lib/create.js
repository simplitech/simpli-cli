const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const rimraf = require('rimraf')
const inquirer = require('inquirer')
const Scaffold = require('./Scaffold')
const clearConsole = require('./util/clearConsole')
const { error, stopSpinner } = require('@vue/cli-shared-utils')

async function create (projectName, options) {
  const inCurrent = projectName === '.'
  const name = inCurrent ? path.relative('../', process.cwd()) : projectName
  const targetDir = path.resolve(projectName || '.')

  if (fs.existsSync(targetDir)) {
    if (options.force) {
      rimraf.sync(targetDir)
    } else {
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
    }
  }

  const { type } = await inquirer.prompt([
    {
      name: 'type',
      type: 'list',
      message: 'What type of project is it?',
      choices: [
        { name: 'Web App project (frontend)', value: 'webapp' },
        { name: 'Web Server project (backend)', value: 'webserver' },
        { name: 'Cancel', value: false }
      ]
    }
  ])
  if (!type) {
    return
  }

  if (type === 'webapp') return createScaffold(name, targetDir, options)
  else if (type === 'webserver') return createApi(name, targetDir, options)
}

async function createScaffold (name, targetDir, options) {
  // Insert module names
  const promptModules = [
  ].map(file => require(`./promptModules/${file}`))

  const scaffold = new Scaffold(name, targetDir, promptModules)

  if (!options.default) {
    await scaffold.setup()
  }

  await scaffold.create(options)
}

async function createApi (name, targetDir, options) {
}

module.exports = (...args) => {
  create(...args).catch(err => {
    stopSpinner(false) // do not persist
    error(err)
    process.exit(1)
  })
}
