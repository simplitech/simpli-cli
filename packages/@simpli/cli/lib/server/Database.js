const inquirer = require('inquirer')
const mysql = require('promise-mysql')
const camelCase = require('lodash.camelcase')
const {
  error
} = require('@vue/cli-shared-utils')

module.exports = class Database {
  static async requestConnection (serverSetup, defaultConfig = {}) {
    const { host } = defaultConfig.host ? defaultConfig
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

    const { port } = defaultConfig.port ? defaultConfig
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

    const { user } = defaultConfig.user ? defaultConfig
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

    const { password } = defaultConfig.password ? defaultConfig
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

    const { database } = defaultConfig.database ? defaultConfig
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

    try {
      const pool = mysql.createPool({ host, port, user, password, database })

      const getFirstKey = (obj) => Object.keys(obj)[0] || null

      const queryTables = await pool.query(`SHOW TABLES;`)
      const allTableNames = queryTables.map((row) => row[getFirstKey(row)])

      for (const i in allTableNames) {
        const tableName = allTableNames[i]
        const tableScheme = await pool.query(`DESCRIBE ${tableName};`)
        const tableRelations = await pool.query(`
        SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE REFERENCED_TABLE_NAME IS NOT NULL AND REFERENCED_COLUMN_NAME IS NOT NULL
        AND TABLE_NAME = '${tableName}';
        `)
        dataTables.push({ tableName, tableScheme, tableRelations })
      }

      pool.end()
    } catch (e) {
      error(e.sqlMessage || e)
      process.exit(1)
    }

    serverSetup.injectDatabase(dataTables)

    const availableTables = serverSetup.tables
    const allTables = serverSetup.models

    if (availableTables.length === 0) {
      error('Database must have at least 1 table\nRun simpli server:inspect to analise your database')
      process.exit(1)
    }

    const connection = { host, port, user, password, database }

    return { connection, dataTables, availableTables, allTables }
  }

  static async requestServerName (defaultName) {
    const capitalizeFirstLetter = (str = '') => str.charAt(0).toUpperCase() + str.slice(1)

    const { serverName } = await inquirer.prompt([
      {
        name: 'serverName',
        type: 'input',
        message: 'Enter the server name',
        default: capitalizeFirstLetter(camelCase(defaultName))
      }
    ])
    if (!serverName) {
      error('Server name is required')
      process.exit(1)
    }

    return { serverName }
  }

  static async requestTables (availableTables = [], serverSetup) {
    const { useAllTables } = await inquirer.prompt([
      {
        name: 'useAllTables',
        type: 'confirm',
        message: 'Add all available tables?'
      }
    ])

    let filteredTables
    if (!useAllTables) {
      const { filteredTableNames } = await inquirer.prompt([
        {
          name: 'filteredTableNames',
          type: 'checkbox',
          choices: availableTables.map((table) => table.name),
          message: 'Which of these tables do you want to include?'
        }
      ])

      filteredTables = serverSetup.tables
        .filter((table) => filteredTableNames.find((name) => name === table.name))
    } else filteredTables = availableTables

    serverSetup.tables = filteredTables
    return { filteredTables }
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

  static async requestUserTable (availableTables = [], filteredTables = []) {
    const { userTableName } = await inquirer.prompt([
      {
        name: 'userTableName',
        type: 'list',
        choices: availableTables.map((table) => table.name),
        default: availableTables.findIndex((table) => table.name === 'user') || 0,
        message: 'Which of these tables is the user table (for login)?'
      }
    ])
    const userTable = availableTables.find((table) => table.name === userTableName)
    const availableColumns = userTable.columns

    const { accountColumnName } = await inquirer.prompt([
      {
        name: 'accountColumnName',
        type: 'list',
        choices: availableColumns.map((column) => column.name),
        default: availableColumns.findIndex((column) => column.name === 'email') || 0,
        message: 'Which of these columns is the account column?'
      }
    ])
    const { passwordColumnName } = await inquirer.prompt([
      {
        name: 'passwordColumnName',
        type: 'list',
        choices: availableColumns.map((column) => column.name),
        default: availableColumns.findIndex((column) => column.name === 'user') || 0,
        message: 'Which of these columns is the password column?'
      }
    ])
    const accountColumn = availableColumns.find((column) => column.name === accountColumnName)
    const passwordColumn = availableColumns.find((column) => column.name === passwordColumnName)

    const exists = (name) => !!filteredTables.find((table) => table.name === name)

    // Add table if they do not exist
    if (!exists(userTable.name)) filteredTables.push(userTable)

    return { userTable, accountColumn, passwordColumn }
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
}
