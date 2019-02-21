#!/usr/bin/env node

const chalk = require('chalk')
const semver = require('semver')
const requiredVersion = require('../package.json').engines.node

if (!semver.satisfies(process.version, requiredVersion)) {
  console.log(chalk.red(
    `You are using Node ${process.version}, but this version of simpli-cli ` +
    `requires Node ${requiredVersion}.\nPlease upgrade your Node version.`
  ))
  process.exit(1)
}

const program = require('commander')

program
  .version(require('../package').version)
  .usage('<command> [options]')

program
  .command('new:project <project-name>')
  .description('create a new simpli project')
  .option('-d, --default', 'skip prompts and use default preset')
  .option('-f, --force', 'overwrite target directory if it exists')
  .option('-D, --debug', 'run in debug mode')
  .action((name, cmd) => {
    require('../lib/cmd/newProject')(name, cleanArgs(cmd))
  })

program
  .command('new:seed')
  .description('create test data from a backend project and store it into data.sql')
  .option('-D, --debug', 'run in debug mode')
  .action((cmd) => {
    require('../lib/cmd/newSeed')(cleanArgs(cmd))
  })

program
  .command('scaffold:inspect [paths...]')
  .description('inspect the models and APIs based on swagger')
  .action((paths) => {
    require('../lib/cmd/scaffoldInspect')(paths)
  })

program
  .command('scaffold:sync')
  .description('synchronize the models of the current frontend project based on its web server swagger')
  .option('-D, --debug', 'run in debug mode')
  .action((cmd) => {
    require('../lib/cmd/scaffoldSync')(cleanArgs(cmd))
  })

program
  .command('server:inspect [paths...]')
  .description('inspect the tables of a MySQL database')
  .action((paths) => {
    require('../lib/cmd/serverInspect')(paths)
  })

program
  .command('server:sync')
  .description('synchronize the tables of the current backend project based on its MySQL database')
  .option('-D, --debug', 'run in debug mode')
  .action((cmd) => {
    require('../lib/cmd/serverSync')(cleanArgs(cmd))
  })

program
  .command('server:seed')
  .description('seed the database with test data from the current backend project')
  .option('-f, --force', 'force seeding')
  .action((cmd) => {
    require('../lib/cmd/serverSeed')(cleanArgs(cmd))
  })

// output help information on unknown commands
program
  .arguments('<command>')
  .action((cmd) => {
    program.outputHelp()
    console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
    console.log()
  })

// add some useful info on help
program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`simpli <command> --help`)} for detailed usage of given command.`)
  console.log()
})

program.commands.forEach(c => c.on('--help', () => console.log()))

// enhance common error messages
const enhanceErrorMessages = (methodName, log) => {
  program.Command.prototype[methodName] = function (...args) {
    if (methodName === 'unknownOption' && this._allowUnknownOption) {
      return
    }
    this.outputHelp()
    console.log(`  ` + chalk.red(log(...args)))
    console.log()
    process.exit(1)
  }
}

enhanceErrorMessages('missingArgument', argName => {
  return `Missing required argument ${chalk.yellow(`<${argName}>`)}.`
})

enhanceErrorMessages('unknownOption', optionName => {
  return `Unknown option ${chalk.yellow(optionName)}.`
})

enhanceErrorMessages('optionMissingArgument', (option, flag) => {
  return `Missing required argument for option ${chalk.yellow(option.flags)}` + (
    flag ? `, got ${chalk.yellow(flag)}` : ``
  )
})

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs (cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = o.long.replace(/^--/, '')
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function') {
      args[key] = cmd[key]
    }
  })
  return args
}
