const Table = require('./Table')
const Column = require('./Column')
const Relation = require('./Relation')
const camelCase = require('lodash.camelcase')
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
    // Inject dynamic data
    this.tables.forEach((table) => {
      table.validRelations.forEach((relation) => {
        const table = this.findTableByName(relation.tableName) || {}
        const referencedTable = this.findTableByName(relation.referencedTableName) || {}
        const column = table.findColumnByName(relation.columnName) || {}
        relation.tableModelName = table.modelName
        relation.referencedTableModelName = referencedTable.modelName
        relation.columnNullable = column.nullable
        column.foreign = relation
      })
      table.setPivot()
    })
    // Inject manyToMany data
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

        const relation = new Relation()
        relation.name = camelCase(table.name)
        relation.isValid = true
        relation.tableName = tableTarget.name
        relation.tableModelName = tableTarget.modelName
        relation.referencedTableName = tableRef.name
        relation.referencedTableModelName = tableRef.modelName
        relation.isManyToMany = true
        relation.pivot.name = table.instanceName
        relation.pivot.tableName = table.name
        relation.pivot.tableModelName = table.modelName

        tableTarget.relations.push(relation)
      })
    })
    // Set pivot reference
    this.tables.forEach((table) => {
      if (table.hasPivot) {
        const relation = table.relations.find((relation) => relation.isManyToMany)
        const pivotTable = this.tables.find((table) => table.name === relation.pivot.tableName)
        if (pivotTable) {
          table.manyToMany.pivotTableName = pivotTable.name
          table.manyToMany.pivotModelName = pivotTable.modelName
          table.manyToMany.pivotInstanceName = pivotTable.instanceName

          const column = pivotTable
            .foreignColumns.find((column) => column.foreign.referencedTableModelName !== table.modelName)

          if (column) {
            table.manyToMany.crossRelationTableName = column.foreign.referencedTableName
            table.manyToMany.crossRelationModelName = column.foreign.referencedTableModelName
            table.manyToMany.crossRelationInstanceName = column.foreign.name
            table.manyToMany.crossRelationColumnName = column.foreign.referencedColumnName
          }
        }
      }
    })
  }

  // Helpers
  uuid () {
    return uuid.v4()
  }
  capitalizeFirstLetter (str = '') {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
}
