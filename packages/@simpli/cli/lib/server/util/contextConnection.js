/* eslint-disable handle-callback-err */
const fs = require('fs')
const path = require('path')
const xml2js = require('xml2js')

module.exports = async (callback) => {
  const context = path.resolve('./src/main/webapp/META-INF/context.xml')
  const parser = new xml2js.Parser()
  const connection = {
    host: null,
    port: null,
    user: null,
    password: null,
    database: null
  }

  const injectData = (data, connection) => {
    const url = data.url
    const pattern = /^(?:\w+:)*(?:mysql:\/\/)(\w+):(\d+)\/(\w+)$/g
    const match = pattern.exec(url)
    if (match) {
      connection.host = match[1]
      connection.port = match[2]
      connection.database = match[3]
      connection.user = data.username
      connection.password = data.password
    }
  }

  await fs.readFile(context, async (err, data) => {
    await parser.parseString(data, async (err, result) => {
      let dataContext = {}
      try {
        dataContext = result.Context.Resource[0].$ || {}
      } catch (e) {}

      injectData(dataContext, connection)

      callback(connection)
    })
  })
}
