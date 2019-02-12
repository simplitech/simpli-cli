/* eslint-disable handle-callback-err */
const fs = require('fs')
const mysql = require('promise-mysql')
const {
  error,
  stopSpinner
} = require('@vue/cli-shared-utils')

module.exports = (path, connection) => {
  const fetch = (resolve, reject) => {
    try {
      fs.readFile(path, 'utf8', async (err, data) => {
        connection.multipleStatements = true

        const conn = await mysql.createConnection(connection)
        await conn.query(data)
        await conn.end()

        resolve()

        stopSpinner()
      })
    } catch (e) {
      error(e.sqlMessage || e)
      process.exit(1)
      reject()
    }
  }

  return new Promise(fetch)
}
