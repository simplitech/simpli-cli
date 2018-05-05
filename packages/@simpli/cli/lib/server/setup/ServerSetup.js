const Table = require('./Table')
const Column = require('./Column')
const Relation = require('./Relation')
const ManyToMany = require('./ManyToMany')
const camelCase = require('lodash.camelcase')
const uniqBy = require('lodash.uniqby')
const uuid = require('uuid')
const faker = require('faker')

module.exports = class ServerSetup {
  constructor () {
    this.serverName = null
    this.moduleName = null
    this.packageAddress = null
    this.connection = {
      host: null,
      port: null,
      user: null,
      password: null,
      database: null
    }
    this.userTable = new Table()
    this.accountColumn = new Column()
    this.passwordColumn = new Column()
    this.seedSamples = null
    this.tables = []
  }

  get commonTables () {
    return this.tables.filter((table) => !table.isPivot)
  }

  get pivotTables () {
    return this.tables.filter((table) => table.isPivot)
  }

  get packageDir () {
    return (this.packageAddress || '').replace('.', '\/')
  }

  findTableByName (name) {
    return this.tables.find((table) => table.name === name)
  }

  injectDatabase (dataTables = []) {
    this.setTables(dataTables)
  }

  setTables (dataTables = []) {
    this.tables = dataTables.map((dataTable) => new Table(dataTable))

    // Inject missing data of relation
    this.tables.forEach((table) => {
      table.validRelations.forEach((relation) => {
        const table = this.findTableByName(relation.tableName)
        const referencedTable = this.findTableByName(relation.referencedTableName)
        const column = table.findColumnByName(relation.columnName)

        if (!table || !referencedTable || !column) {
          relation.isValid = false
        } else {
          relation.tableModelName = table.modelName
          relation.referencedTableInstanceName = referencedTable.instanceName
          relation.referencedTableModelName = referencedTable.modelName
          relation.columnNullable = column.nullable
          column.foreign = relation
        }
      })
      table.setPivot()
    })

    // Populate manyToMany relation
    this.pivotTables.forEach((table) => {
      const foreignColumns = table.foreignColumns
      // Set the samples
      const columnRef1 = foreignColumns[0]
      const columnRef2 = foreignColumns[1]

      // Inject into each involved table
      foreignColumns.forEach((column) => {
        let columnRef
        if (column.name === columnRef1.name) columnRef = columnRef2
        else if (column.name === columnRef2.name) columnRef = columnRef1
        else return

        const tableTarget = this.findTableByName(column.foreign.referencedTableName)
        const tableRef = this.findTableByName(columnRef.foreign.referencedTableName)

        if (!tableTarget || !tableRef) return

        const relation = new Relation()
        relation.name = camelCase(table.name)
        relation.isValid = true
        relation.tableName = tableTarget.name
        relation.tableModelName = tableTarget.modelName
        relation.columnName = columnRef.foreign.columnName
        relation.columnNullable = columnRef.foreign.columnNullable
        relation.constraintName = columnRef.foreign.constraintName
        relation.referencedTableName = tableRef.name
        relation.referencedTableInstanceName = tableRef.instanceName
        relation.referencedTableModelName = tableRef.modelName
        relation.referencedColumnName = columnRef.foreign.referencedColumnName
        relation.isManyToMany = true
        relation.pivot.name = table.instanceName
        relation.pivot.tableName = table.name
        relation.pivot.tableModelName = table.modelName

        tableTarget.relations.push(relation)
        // Prevent repetition
        tableTarget.relations = uniqBy(tableTarget.relations, 'name')
      })
    })

    // Populate manyToMany
    this.tables.forEach((table) => {
      if (table.hasPivot) {
        const relations = table.relations.filter((relation) => relation.isManyToMany)
        const pivotTables = this.tables.filter((table) => relations.find((relation) => table.name === relation.pivot.tableName))
        pivotTables.forEach((pivotTable) => {
          const manyToMany = new ManyToMany()
          manyToMany.pivotTableName = pivotTable.name
          manyToMany.pivotModelName = pivotTable.modelName
          manyToMany.pivotInstanceName = pivotTable.instanceName

          const column = pivotTable.foreignColumns
            .find((column) => column.foreign.referencedTableModelName !== table.modelName)

          if (column) {
            manyToMany.crossRelationTableName = column.foreign.referencedTableName
            manyToMany.crossRelationModelName = column.foreign.referencedTableModelName
            manyToMany.crossRelationInstanceName = column.foreign.name
            manyToMany.crossRelationColumnName = column.foreign.referencedColumnName

            table.manyToMany.push(manyToMany)
            // Prevent repetition
            table.manyToMany = uniqBy(table.manyToMany, 'pivotTableName')
          }
        })
      }
    })
  }

  /**
   * Stringfy the params of pivot DAO insert
   */
  insertPivotByComma (refTable, m2m) {
    const pivotTable = this.tables.find((table) => table.name === m2m.pivotTableName)
    if (pivotTable) {
      const columns = pivotTable.primaryColumns
      return columns.map((column) => {
        if (column.isForeign && m2m.crossRelationTableName === column.foreign.referencedTableName) {
          return `${m2m.crossRelationInstanceName}.${m2m.crossRelationColumnName}`
        }
        return `id${refTable.modelName}`
      }).join(', ')
    }
    return ''
  }

  // Helpers
  uuid () {
    return uuid.v4()
  }

  capitalizeFirstLetter (str = '') {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  randomString (length) {
    return faker.random.alphaNumeric(length)
  }

  dataFactory () {
    let result = ''
    const samples = this.seedSamples || 1

    result += `SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;\n`
    result += `SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;\n`
    result += `SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';\n\n`

    result += `USE ${this.connection.database};\n\n`

    this.tables.forEach((table) => {
      result += `TRUNCATE TABLE \`${table.name}\`;\n`
    })

    result += `\n`

    this.tables.forEach((table) => {
      const isUserTable = table.name === this.userTable.name

      result += `LOCK TABLES \`${table.name}\` WRITE;\n\n`

      result += `INSERT INTO \`${table.name}\`\n`
      result += `(`
      table.columns.forEach((column) => {
        result += `${column.name},`
      })
      result = result.slice(0, -1) // remove last comma
      result += `)\n`
      result += `VALUES\n`

      for (let i = 0; i < samples; i++) {
        result += `(`
        table.columns.forEach((column) => {
          if (column.isID) {
            result += `${i + 1}`
          } else if (column.isForeign) {
            if (i === 0 || !table.hasID) result += `${i + 1}`
            else result += `${faker.random.number({ min: 1, max: samples })}`
          } else if (column.isString) {
            if (column.isEmail) {
              const accountColumn = column.name === this.accountColumn.name
              if (isUserTable && accountColumn && i === 0) result += `'test@test.com'`
              else result += `'${faker.internet.email()}'`
            } else if (column.isPassword) result += `SHA2(SHA2('tester', 256), 256)`
            else if (column.isUrl) result += `'${faker.internet.url()}'`
            else if (column.isImageUrl) result += `'${faker.image.imageUrl()}'`
            else if (column.isUnique) result += `'${faker.random.uuid()}'`
            else {
              if (column.size && column.size > 128) result += `'${faker.lorem.sentence()}'`
              else if (column.size && column.size > 32) result += `'${faker.lorem.words()}'`
              else result += `'${faker.lorem.word()}'`
            }
          } else if (column.isLong) {
            result += `${faker.random.number({ max: 999 })}`
          } else if (column.isDouble) {
            result += `${faker.random.number({ max: 999 })}.${faker.random.number({ max: 999 })}`
          } else if (column.isBoolean) {
            result += `${faker.random.number({ max: 1 })}`
          } else if (column.isDate) {
            result += `'${(faker.date.past() || new Date()).toISOString().substring(0, 23).replace('T', ' ')}'`
          }
          result += `,`
        })
        result = result.slice(0, -1) // remove last comma
        result += `),\n`
      }
      result = result.slice(0, -2) // remove last comma
      result += `;\n\n`

      result += `UNLOCK TABLES;\n\n`
    })

    result += `SET SQL_MODE=@OLD_SQL_MODE;\n`
    result += `SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;\n`
    result += `SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;\n`

    return result
  }
}
