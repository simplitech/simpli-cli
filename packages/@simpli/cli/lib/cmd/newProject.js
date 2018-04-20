const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const rimraf = require('rimraf')
const inquirer = require('inquirer')
const Scaffold = require('../scaffold/Scaffold')
const clearConsole = require('../util/clearConsole')
const { error, stopSpinner } = require('@vue/cli-shared-utils')

async function create (projectName, options) {
  const inCurrent = projectName === '.'
  const name = inCurrent ? path.relative('../', process.cwd()) : projectName
  const targetDir = path.resolve(projectName || '.')

  await clearConsole(true)
  if (fs.existsSync(targetDir)) {
    if (options.force) {
      rimraf.sync(targetDir)
    } else {
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
    const { preset } = await inquirer.prompt([
      {
        name: 'preset',
        type: 'list',
        message: 'What method of preset will you use?',
        choices: [
          { name: 'Swagger from the web server', value: 'swagger' },
          { name: 'No preset (empty project)', value: 'no-preset' },
          { name: 'Cancel', value: false }
        ]
      }
    ])
    if (preset === 'no-preset') {
      await scaffold.swaggerDefaultSetup()
    } else if (preset === 'swagger') {
      await scaffold.swaggerSetup()
    } else {
      return
    }
  } else await scaffold.swaggerDefaultSetup()

  await scaffold.create(options)
}

async function createApi (name, targetDir, options) {
  console.info(`${chalk.yellowBright(`Backend generator was not done yet. Use the legacy generator instead`)}`)
  console.info(`${chalk.bold(`https://www.npmjs.com/package/generator-martinlabs`)}`)
}

module.exports = (...args) => {
  create(...args).catch(err => {
    stopSpinner(false) // do not persist
    error(err)
    process.exit(1)
  })
}
