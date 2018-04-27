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
    this.serverSetup = new ServerSetup()
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
    // Normalize database
    const {
      connection,
      dataTables,
      availableTables,
      allTables
    } = await Database.requestConnection(this.serverSetup)

    await Database.confirm()

    // this.serverSetup.serverName =
    // this.serverSetup.packageAddress =
    // this.serverSetup.module =

    this.serverSetup.connection = connection

    // this.serverSetup.loginTable =
    // this.serverSetup.accountColumn =
    // this.serverSetup.passwordColumn =
  }

  async create () {
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
    log(`⚙  Installing CLI plugins. This might take a while...`)
    log()
    await installDeps(context, 'npm')

    // run generator
    log()
    log(`🚀  Invoking generators...`)
    const plugins = this.resolvePlugins(preset.plugins)
    const generator = new Generator(context, {
      pkg,
      plugins,
      completeCbs: createCompleteCbs
    })
    await generator.generate({
      extractConfigFiles: preset.useConfigFiles
    })

    // install additional deps (injected by generators)
    log(`📦  Installing additional dependencies...`)
    log()
    await installDeps(context, 'npm')

    // run complete cbs if any (injected by generators)
    log()
    logWithSpinner('⚓', `Running completion hooks...`)
    for (const cb of createCompleteCbs) {
      await cb()
    }

    // commit initial state
    if (hasGit()) {
      await run('git add -A')
      await run(`git commit -m init`)
    }

    // log instructions
    stopSpinner()
    log()
    log(`🎉  Successfully created server project ${chalk.yellow(name)}.`)
    log()

    generator.printExitLogs()
  }

  resolvePlugins (rawPlugins) {
    // ensure cli-service is invoked first
    rawPlugins = sortObject(rawPlugins, ['@simpli/cli-server'])
    return Object.keys(rawPlugins).map(id => {
      const module = resolve.sync(`${id}/generator`, { basedir: this.context })
      // const module = resolve.sync('../../../cli-server/generator')
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
