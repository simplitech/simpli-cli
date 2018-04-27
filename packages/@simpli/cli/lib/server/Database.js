const inquirer = require('inquirer')
// const chalk = require('chalk')
const mysql = require('promise-mysql')
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
