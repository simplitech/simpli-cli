const Table = require('./Table')
const Column = require('./Column')
const Relation = require('./Relation')
const ManyToMany = require('./ManyToMany')
const camelCase = require('lodash.camelcase')
const uniqBy = require('lodash.uniqby')
const uuid = require('uuid')

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
  randomString (len, an) {
    an = an && an.toLowerCase()
    let str = ''
    const min = an === 'a' ? 10 : 0
    const max = an === 'n' ? 10 : 62
    for (let i = 0; i < len; i++) {
      let r = Math.random() * (max - min) + min << 0
      str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48)
    }
    return str
  }
}
