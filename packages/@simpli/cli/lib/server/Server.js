/* eslint-disable no-unused-vars */
const chalk = require('chalk')
const debug = require('debug')
const execa = require('execa')
const resolve = require('resolve')
const inquirer = require('inquirer')
const Generator = require('../Generator')
const ServerSetup = require('./setup/ServerSetup')
const Database = require('./Database')
const cloneDeep = require('lodash.clonedeep')
const sortObject = require('../util/sortObject')
const getVersions = require('../util/getVersions')
const { installDeps } = require('../util/installDeps')
const clearConsole = require('../util/clearConsole')
const PromptModuleAPI = require('../PromptModuleAPI')
const writeFileTree = require('../util/writeFileTree')
const formatFeatures = require('../util/formatFeatures')
const fetchRemotePreset = require('../util/fetchRemotePreset')
const request = require('../util/request.js')
const fs = require('fs')

const {
  log,
  error,
  hasGit,
  hasYarn,
  logWithSpinner,
  stopSpinner
} = require('@vue/cli-shared-utils')

const isManualMode = answers => answers.preset === '__manual__'

module.exports = class Server {
  constructor (name, context, promptModules) {
    this.name = name
    this.context = process.env.SIMPLI_CLI_CONTEXT = context
    this.serverSetup = new ServerSetup(name)
    const { presetPrompt, featurePrompt } = this.resolveIntroPrompts()
    this.presetPrompt = presetPrompt
    this.featurePrompt = featurePrompt
    this.outroPrompts = this.resolveOutroPrompts()
    this.injectedPrompts = []
    this.promptCompleteCbs = []
    this.createCompleteCbs = []

    const promptAPI = new PromptModuleAPI(this)
    promptModules.forEach(m => m(promptAPI))
  }

  async databaseSetup () {
    // Get data normalize database
    const { connection, availableTables, createSQL } = await Database.requestConnection(this.serverSetup)

    // Set the server name
    const { serverName } = await Database.requestServerName(this.name)

    // Set module name and package address
    const { moduleName, packageAddress } = await Database.requestModuleAndPackage(serverName)

    // Select tables to be added
    const { filteredTables } = await Database.requestTables(availableTables, this.serverSetup)

    // Set user table
    const {
      userTable,
      accountColumn,
      passwordColumn
    } = await Database.requestUserTable(availableTables, filteredTables)

    // Add data.sql
    const { seedSamples } = await Database.requestSeedSamples()

    await Database.confirm()

    this.serverSetup.serverName = serverName
    this.serverSetup.moduleName = moduleName
    this.serverSetup.packageAddress = packageAddress

    this.serverSetup.connection = connection

    this.serverSetup.userTable = userTable
    this.serverSetup.accountColumn = accountColumn
    this.serverSetup.passwordColumn = passwordColumn

    this.serverSetup.seedSamples = seedSamples
    this.serverSetup.createSQL = createSQL
  }

  async create (options = {}) {
    const { name, context, createCompleteCbs, serverSetup } = this

    const run = (command, args) => {
      if (!args) { [command, ...args] = command.split(/\s+/) }
      return execa(command, args, { cwd: context })
    }

    let preset = await this.promptAndResolvePreset()
    // clone before mutating
    preset = cloneDeep(preset)
    // inject core service
    preset.plugins['@simpli/cli-server'] = Object.assign({
      projectName: name,
      serverSetup
    }, preset)

    // get latest CLI version
    const { latest } = await getVersions()
    // generate package.json with plugin dependencies
    const pkg = {
      name,
      version: '0.1.0',
      private: true,
      devDependencies: {}
    }
    const deps = Object.keys(preset.plugins)
    deps.forEach(dep => {
      pkg.devDependencies[dep] = preset.plugins[dep].version ||
        (/^@simpli/.test(dep) ? `${latest}` : `latest`)
    })
    // write package.json
    await writeFileTree(context, {
      'package.json': JSON.stringify(pkg, null, 2)
    })

    await clearConsole()
    logWithSpinner(`✨`, `Creating project in ${chalk.yellow(context)}.`)

    // intilaize git repository before installing deps
    // so that vue-cli-service can setup git hooks.
    if (hasGit()) {
      logWithSpinner(`🗃`, `Initializing git repository...`)
      await run('git init')
    }

    // install plugins
    stopSpinner()
    log(`⚙  Preparing the package...`)
    log()
    await installDeps(context, 'npm')

    // run generator
    log()
    log(`🚀  Invoking generators...`)
    const plugins = this.resolvePlugins(preset.plugins, options.debug)
    const generator = new Generator(context, {
      pkg,
      plugins,
      completeCbs: createCompleteCbs
    })
    await generator.generate({
      extractConfigFiles: preset.useConfigFiles
    })

    await run(`rm -rf ./node_modules`)
    await run(`rm -f ./package.json`)
    await run(`rm -f ./package-lock.json`)

    // commit initial state
    if (hasGit()) {
      await run('git add -A')
      await run(`git commit -m init`)
    }

    // log instructions
    stopSpinner()
    log()
    log(`🎉  Successfully created server project ${chalk.yellow(name)}.`)
    log(`👉  Make sure the port ${chalk.cyan(`8080`)} is not in use`)
    log(`👉  Get started with the following commands:`)
    log()
    log(`👉  ${chalk.cyan(` ${chalk.gray('$')} cd ${name}`)}`)
    log(`👉  ${chalk.cyan(` ${chalk.gray('$')} simpli server:seed`)}`)
    log(`👉  ${chalk.cyan(` ${chalk.gray('$')} sh build.sh`)}`)
    log()
    log(`👉  Check your server status in ${chalk.yellow('http://localhost:8080')}`)
    log(`👉  The APIs endpoint base is ${chalk.yellow('http://localhost:8080/api')}`)
    log(`👉  The swagger docs is located in ${chalk.yellow('http://localhost:8080/docs')}`)
    log(`👉  The swagger JSON is located in ${chalk.yellow('http://localhost:8080/api/swagger.json')}`)
    log()

    generator.printExitLogs()
  }

  async syncModels (defaultConnection, options = {}) {
    const run = (command, args) => {
      if (!args) { [command, ...args] = command.split(/\s+/) }
      return execa(command, args, { cwd: context })
    }

    const { moduleName, packageAddress } = await Database.requestModuleAndPackage()
    const { availableTables } = await Database.requestConnection(this.serverSetup, defaultConnection)
    const { syncTables } = await Database.requestSync(availableTables, this.serverSetup)
    await Database.confirm()

    this.serverSetup.moduleName = moduleName
    this.serverSetup.packageAddress = packageAddress

    const { context, createCompleteCbs } = this

    const preset = {
      plugins: {
        '@simpli/cli-server': {
          serverSetup: this.serverSetup,
          sync: true
        }
      }
    }

    // get latest CLI version
    const { latest } = await getVersions()
    // generate package.json with plugin dependencies
    const pkg = {
      name: 'sync-server',
      version: '0.1.0',
      private: true,
      devDependencies: {}
    }
    const deps = Object.keys(preset.plugins)
    deps.forEach(dep => {
      pkg.devDependencies[dep] = preset.plugins[dep].version ||
        (/^@simpli/.test(dep) ? `${latest}` : `latest`)
    })
    // write package.json
    await writeFileTree(context, {
      'package.json': JSON.stringify(pkg, null, 2)
    })

    // install plugins
    await clearConsole()
    log(`⚙  Preparing the package...`)
    log()
    await installDeps(context, 'npm')

    log()
    log(`⚙️  Synchronizing tables...`)
    const plugins = this.resolvePlugins(preset.plugins, options.debug)
    const generator = new Generator(context, {
      pkg: { _ignore: true },
      plugins,
      completeCbs: createCompleteCbs
    })
    await generator.generate()

    await run(`rm -rf ./node_modules`)
    await run(`rm -f ./package.json`)
    await run(`rm -f ./package-lock.json`)

    log()
    log(`🎉  Successfully synchronized tables ${chalk.yellow(syncTables.map((tables) => tables.name).join(', '))}.`)
    log(`👉  Run ${chalk.cyan('git status')} to see which files has changed.`)
    log(`👉  Run ${chalk.cyan('git add . && git stash')} to revert the changes safely.\n\n`)
  }

  async newSeed (defaultConnection, options = {}) {
    const run = (command, args) => {
      if (!args) { [command, ...args] = command.split(/\s+/) }
      return execa(command, args, { cwd: context })
    }

    // Get data normalize database
    const { connection, availableTables, createSQL } = await Database.requestConnection(this.serverSetup, defaultConnection)
    // Select tables to be added
    const { filteredTables } = await Database.requestTables(availableTables, this.serverSetup)

    // Set user table
    const {
      userTable,
      accountColumn,
      passwordColumn
    } = await Database.requestUserTable(availableTables, filteredTables)

    // Define number of seed samples
    const { seedSamples } = await Database.requestSeedSamples()

    await Database.confirm()

    this.serverSetup.connection = connection
    this.serverSetup.seedSamples = seedSamples
    this.serverSetup.createSQL = createSQL

    this.serverSetup.userTable = userTable
    this.serverSetup.accountColumn = accountColumn
    this.serverSetup.passwordColumn = passwordColumn

    const { context, createCompleteCbs } = this

    const preset = {
      plugins: {
        '@simpli/cli-server': {
          serverSetup: this.serverSetup,
          seed: true
        }
      }
    }

    // get latest CLI version
    const { latest } = await getVersions()
    // generate package.json with plugin dependencies
    const pkg = {
      name: 'sync-server',
      version: '0.1.0',
      private: true,
      devDependencies: {}
    }
    const deps = Object.keys(preset.plugins)
    deps.forEach(dep => {
      pkg.devDependencies[dep] = preset.plugins[dep].version ||
        (/^@simpli/.test(dep) ? `${latest}` : `latest`)
    })
    // write package.json
    await writeFileTree(context, {
      'package.json': JSON.stringify(pkg, null, 2)
    })

    // install plugins
    await clearConsole()
    log(`⚙  Preparing the package...`)
    log()
    await installDeps(context, 'npm')

    log()
    log(`⚙️  Creating create.sql and data.sql...`)
    const plugins = this.resolvePlugins(preset.plugins, options.debug)
    const generator = new Generator(context, {
      pkg: { _ignore: true },
      plugins,
      completeCbs: createCompleteCbs
    })
    await generator.generate()

    await run(`rm -rf ./node_modules`)
    await run(`rm -f ./package.json`)
    await run(`rm -f ./package-lock.json`)

    log()
    log(`🎉  Successfully created data.sql`)
  }

  resolvePlugins (rawPlugins, debug = false) {
    // ensure cli-service is invoked first
    rawPlugins = sortObject(rawPlugins, ['@simpli/cli-server'])
    return Object.keys(rawPlugins).map(id => {
      if (debug) {
        log(`Building generator in DEBUG MODE...`)
      }
      const module = !debug
        ? resolve.sync(`${id}/generator`, { basedir: this.context })
        : resolve.sync(`../../../cli-server/generator`)
      return {
        id,
        apply: require(module),
        options: rawPlugins[id]
      }
    })
  }

  async promptAndResolvePreset () {
    // prompt
    await clearConsole(true)
    const answers = await inquirer.prompt(this.resolveFinalPrompts())

    // manual
    const preset = {
      useConfigFiles: answers.useConfigFiles === 'files',
      plugins: {}
    }
    answers.features = answers.features || []
    // run cb registered by prompt modules to finalize the preset
    this.promptCompleteCbs.forEach(cb => cb(answers, preset))

    return preset
  }

  resolveIntroPrompts () {
    const presetPrompt = {
      name: 'preset',
      type: 'list',
      message: `Please pick a preset:`,
      choices: [
        {
          name: 'Manually select features',
          value: '__manual__'
        }
      ]
    }
    const featurePrompt = {
      name: 'features',
      when: isManualMode,
      type: 'checkbox',
      message: 'Check the features needed for your project:',
      choices: [],
      pageSize: 8
    }
    return {
      presetPrompt,
      featurePrompt
    }
  }

  resolveOutroPrompts () {
    const outroPrompts = [
      {
        name: 'useConfigFiles',
        when: isManualMode,
        type: 'list',
        message: 'Where do you prefer placing config for Babel, PostCSS, ESLint, etc.?',
        choices: [
          {
            name: 'In dedicated config files',
            value: 'files'
          },
          {
            name: 'In package.json',
            value: 'pkg'
          }
        ]
      },
      {
        name: 'save',
        when: isManualMode,
        type: 'confirm',
        message: 'Save this as a preset for future projects?'
      },
      {
        name: 'saveName',
        when: answers => answers.save,
        type: 'input',
        message: 'Save preset as:'
      }
    ]

    return outroPrompts
  }

  resolveFinalPrompts () {
    // patch generator-injected prompts to only show in manual mode
    this.injectedPrompts.forEach(prompt => {
      const originalWhen = prompt.when || (() => true)
      prompt.when = answers => {
        return isManualMode(answers) && originalWhen(answers)
      }
    })
    return [
      // this.presetPrompt,
      this.featurePrompt,
      ...this.injectedPrompts
      // ...this.outroPrompts
    ]
  }
}
