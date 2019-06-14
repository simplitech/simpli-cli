/* eslint-disable handle-callback-err */
const inquirer = require('inquirer')
const chalk = require('chalk')
const mysql = require('promise-mysql')
const camelCase = require('lodash.camelcase')
const mysqldump = require('mysqldump')
const runSql = require('./util/runSql')

const {
  log,
  error,
  logWithSpinner
} = require('@vue/cli-shared-utils')

module.exports = class Database {
  static async requestConnection (serverSetup, defaultConfig = {}) {
    const { host } = defaultConfig.host && defaultConfig.host !== 'db' ? defaultConfig
      : await inquirer.prompt([
        {
          name: 'host',
          type: 'input',
          message: 'Enter the MYSQL host',
          default: 'localhost'
        }
      ])
    if (!host) {
      error('You must define the MYSQL host')
      process.exit(1)
    }

    const { port } = defaultConfig.port && defaultConfig.host !== 'db' ? defaultConfig
      : await inquirer.prompt([
        {
          name: 'port',
          type: 'input',
          message: 'Enter the MYSQL port',
          default: 3306
        }
      ])
    if (!port) {
      error('You must define the MYSQL port')
      process.exit(1)
    }

    const { user } = defaultConfig.user && defaultConfig.host !== 'db' ? defaultConfig
      : await inquirer.prompt([
        {
          name: 'user',
          type: 'input',
          message: 'Enter the MYSQL user',
          default: 'root'
        }
      ])
    if (!user) {
      error('You must define the MYSQL user')
      process.exit(1)
    }

    const { password } = defaultConfig.password && defaultConfig.host !== 'db' ? defaultConfig
      : await inquirer.prompt([
        {
          name: 'password',
          type: 'password',
          message: 'Enter the MYSQL password'
        }
      ])
    if (!password) {
      error('You must define the MYSQL password')
      process.exit(1)
    }

    const { database } = defaultConfig.database && defaultConfig.host !== 'db' ? defaultConfig
      : await inquirer.prompt([
        {
          name: 'database',
          type: 'input',
          message: 'Enter the MYSQL database'
        }
      ])
    if (!database) {
      error('You must define the MYSQL database')
      process.exit(1)
    }

    const dataTables = []
    const connection = { host, port, user, password, database }

    try {
      const pool = mysql.createPool(connection)

      const getFirstKey = (obj) => Object.keys(obj)[0] || null

      const queryTables = await pool.query(`SHOW TABLES;`)
      const allTableNames = queryTables.map((row) => row[getFirstKey(row)])

      for (const i in allTableNames) {
        // Get the name of this table
        const tableName = allTableNames[i]

        // Get the scheme (columns) of this table
        const tableScheme = await pool.query(`DESCRIBE ${tableName};`)

        // Get the relations of this table
        const tableRelations = await pool.query(`
        SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE REFERENCED_TABLE_NAME IS NOT NULL AND REFERENCED_COLUMN_NAME IS NOT NULL
        AND TABLE_NAME = '${tableName}' AND TABLE_SCHEMA = '${database}';
        `)

        // Get the commentary of this table
        const queryTableCommentaries = await pool.query(`
        SELECT table_comment 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME='${tableName}' AND TABLE_SCHEMA = '${database}';
        `)
        const tableCommentary = queryTableCommentaries.map((row) => row[getFirstKey(row)])[0] || ''

        // Find all commentaries in the columns and map it into the scheme
        const queryColumnsCommentaries = await pool.query(`
        SELECT COLUMN_NAME, COLUMN_COMMENT
        FROM information_schema.COLUMNS
        WHERE TABLE_NAME='${tableName}' AND TABLE_SCHEMA = '${database}';
        `)
        tableScheme.map((scheme) => {
          const column = queryColumnsCommentaries.find((column) => column['COLUMN_NAME'] === scheme['Field'])
          scheme['Commentary'] = column['COLUMN_COMMENT']
          return scheme
        })

        dataTables.push({ tableName, tableCommentary, tableScheme, tableRelations })
      }

      pool.end()
    } catch (e) {
      error(e.sqlMessage || e)
      process.exit(1)
    }

    const createSQL = await mysqldump({
      connection: {
        host,
        user,
        password,
        database
      },
      dump: {
        data: false
      }
    })

    serverSetup.injectDatabase(dataTables)

    const availableTables = serverSetup.tables
    const allTables = serverSetup.models

    if (availableTables.length === 0) {
      error('Database must have at least 1 table\nRun simpli server:inspect to analise your database')
      process.exit(1)
    }

    return { connection, dataTables, availableTables, allTables, createSQL }
  }

  static async requestServerName (defaultName) {
    const capitalizeFirstLetter = (str = '') => str.charAt(0).toUpperCase() + str.slice(1)

    const { serverName } = await inquirer.prompt([
      {
        name: 'serverName',
        type: 'input',
        message: 'Enter the server name',
        default: defaultName ? capitalizeFirstLetter(camelCase(defaultName)) : undefined
      }
    ])
    if (!serverName) {
      error('Server name is required')
      process.exit(1)
    }

    return { serverName }
  }

  static async requestModuleAndPackage (defaultName) {
    let { moduleName } = await inquirer.prompt([
      {
        name: 'moduleName',
        type: 'input',
        message: 'Enter the module name',
        default: 'admin'
      }
    ])
    if (!moduleName) {
      error('Module name is required')
      process.exit(1)
    }
    moduleName = moduleName.toLowerCase()

    const { packageAddress } = await inquirer.prompt([
      {
        name: 'packageAddress',
        type: 'input',
        message: 'Enter the package address',
        default: `org.${(camelCase(defaultName) || '').toLowerCase()}`
      }
    ])
    if (!packageAddress || !packageAddress.match(/^[a-z][a-z0-9.]*[a-z0-9]$/g)) {
      error('Wrong package format. Example of a valid package: com.simpli')
      process.exit(1)
    }

    return { moduleName, packageAddress }
  }

  static async requestTables (availableTables = [], serverSetup) {
    const { useAllTables } = await inquirer.prompt([
      {
        name: 'useAllTables',
        type: 'confirm',
        message: 'Include all available tables?'
      }
    ])

    let filteredTables
    if (!useAllTables) {
      const { filteredTableNames } = await inquirer.prompt([
        {
          name: 'filteredTableNames',
          type: 'checkbox',
          choices: availableTables.map((table) => table.name),
          message: 'Which tables do you want to include?'
        }
      ])

      filteredTables = serverSetup.tables
        .filter((table) => filteredTableNames.find((name) => name === table.name))
    } else filteredTables = availableTables

    serverSetup.tables = filteredTables
    return { filteredTables }
  }

  static async requestUserTable (availableTables = [], filteredTables = []) {
    const { userTableName } = await inquirer.prompt([
      {
        name: 'userTableName',
        type: 'list',
        choices: availableTables.map((table) => table.name),
        default: availableTables.findIndex((table) => table.name === 'user') || 0,
        message: 'Which table is the user?'
      }
    ])
    const userTable = availableTables.find((table) => table.name === userTableName)
    const availableColumns = userTable.columns

    const { accountColumnName } = await inquirer.prompt([
      {
        name: 'accountColumnName',
        type: 'list',
        choices: availableColumns.map((column) => column.name),
        default: availableColumns.findIndex((column) => !!['account', 'email'].find((name) => column.name === name)) || 0,
        message: 'Which column is the account (for login)?'
      }
    ])
    const { passwordColumnName } = await inquirer.prompt([
      {
        name: 'passwordColumnName',
        type: 'list',
        choices: availableColumns.map((column) => column.name),
        default: availableColumns.findIndex((column) => !!['password', 'senha'].find((name) => column.name === name)) || 0,
        message: 'Which column is the password?'
      }
    ])
    const accountColumn = availableColumns.find((column) => column.name === accountColumnName)
    const passwordColumn = availableColumns.find((column) => column.name === passwordColumnName)

    const exists = (name) => !!filteredTables.find((table) => table.name === name)

    // Add table if they do not exist
    if (!exists(userTable.name)) filteredTables.push(userTable)

    return { userTable, accountColumn, passwordColumn }
  }

  static async requestSeedSamples () {
    const { seedSamples } = await inquirer.prompt([
      {
        name: 'seedSamples',
        type: 'input',
        message: 'How many samples per table in data.sql?',
        default: '50',
        validate: (value) => {
          const valid = !isNaN(parseFloat(value))
          if (valid) {
            const val = Number(value)
            if (val < 1 || val > 500) return 'Enter a value between 1 and 500'
            return true
          }
          return 'Please enter a number'
        }
      }
    ])

    return { seedSamples: Number(seedSamples) }
  }

  static async requestSync (availableTables = [], serverSetup) {
    const { syncTableNames } = await inquirer.prompt([
      {
        name: 'syncTableNames',
        type: 'checkbox',
        choices: availableTables.map((table) => table.name),
        message: 'Which tables do you want to sync?'
      }
    ])

    const syncTables = serverSetup.tables
      .filter((table) => syncTableNames.find((name) => name === table.name))

    serverSetup.tables = syncTables
    return { syncTables }
  }

  static async confirm () {
    const { confirm } = await inquirer.prompt([
      {
        name: 'confirm',
        type: 'confirm',
        message: 'Confirm this set?'
      }
    ])

    if (!confirm) {
      process.exit(1)
    }
  }

  static async seedDatabase (createPath, dataPath, connection, force = false) {
    if (!force && connection.host !== 'localhost' && connection.host !== 'db') {
      error('For security reasons, this operation only allows MySQL host from localhost')
      process.exit(1)
    }

    if (connection.host === 'db') {
      const { host } = await inquirer.prompt([
        {
          name: 'host',
          type: 'input',
          message: 'Enter the MYSQL host',
          default: 'localhost'
        }
      ])
      if (!host) {
        error('You must define the MYSQL host')
        process.exit(1)
      }

      const { port } = await inquirer.prompt([
        {
          name: 'port',
          type: 'input',
          message: 'Enter the MYSQL port of the localhost',
          default: 3306
        }
      ])
      if (!port) {
        error('You must define the MYSQL port of the localhost')
        process.exit(1)
      }

      const { user } = await inquirer.prompt([
        {
          name: 'user',
          type: 'input',
          message: 'Enter the MYSQL user of the localhost',
          default: 'root'
        }
      ])
      if (!user) {
        error('You must define the MYSQL user of the localhost')
        process.exit(1)
      }

      const { password } = await inquirer.prompt([
        {
          name: 'password',
          type: 'password',
          message: 'Enter the MYSQL password of the localhost'
        }
      ])
      if (!password) {
        error('You must define the MYSQL password of the localhost')
        process.exit(1)
      }

      const { database } = await inquirer.prompt([
        {
          name: 'database',
          type: 'input',
          message: 'Enter the MYSQL database'
        }
      ])
      if (!database) {
        error('You must define the MYSQL database')
        process.exit(1)
      }

      connection.host = host
      connection.port = port
      connection.user = user
      connection.password = password
      connection.database = database
    }

    if (!force) {
      log(`${chalk.bgRed(' Danger Zone ')} You are about to truncate tables from database ${chalk.yellow(connection.database)} at ${chalk.yellow(connection.host)}`)
      const { confirm } = await inquirer.prompt([
        {
          name: 'confirm',
          type: 'confirm',
          message: `Do you want to proceed?`,
          default: false
        }
      ])
      if (!confirm) {
        process.exit(1)
      }

      const { databaseConfirm } = await inquirer.prompt([
        {
          name: 'databaseConfirm',
          type: 'input',
          message: 'Enter the name of database to confirm'
        }
      ])
      if (databaseConfirm !== connection.database) {
        error('Wrong database name')
        process.exit(1)
      }
    }

    const database = `${connection.database}`

    logWithSpinner(`✨`, `Seeding ${chalk.yellow(connection.database)}.`)

    delete connection.database
    await runSql(createPath, connection)

    connection.database = database
    await runSql(dataPath, connection)
  }
}
