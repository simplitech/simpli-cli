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
        relation.pivot.tableName = table.name
        relation.pivot.tableModelName = table.modelName

        tableTarget.relations.push(relation)
      })
    })
  }

  // Helpers
  uuid () {
    return uuid.v4()
  }
  capitalizeFirstLetter (str = '') {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  buildRouter () {
    let result = ''
    this.commonTables.forEach((table) => {
      const columns = table.primaryColumns

      // Get
      result += `\t@GET\n`
      result += `\t@Path("/${table.modelName}/${table.primariesBySlash()}")\n`
      result += `\t@ApiOperation(value = "Gets ${table.modelName} of informed id")\n`
      result += `\tfun get${table.modelName}(\n`

      if (columns.length === 0) columns.push({})
      columns.forEach((column) => {
        const id = columns.length <= 1 ? 'id' : column.name
        result += `\t\t@PathParam("${id}") @ApiParam(required = true)\n`
        result += `\t\t\t${id}: ${column.kotlinType}${columns.length <= 1 ? '?' : ''},\n`
      })

      result += `\n\t\t@HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en-US, pt-BR")\n`
      result += `\t\t\tlang: String,\n`
      result += `\t\t@HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")\n`
      result += `\t\t\tclientVersion: String,\n`
      result += `\t\t@HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")\n`
      result += `\t\t\tauthorization: String\n`
      result += `\t): ${table.modelName}Resp {\n`
      result += `\t\t//TODO: review generated method\n`
      result += `\t\treturn pipe.handle {\n`
      result += `\t\t\tcon -> ${table.modelName}Process(con, getLang(lang), clientVersion)\n`
      result += `\t\t\t\t.getOne(${table.primariesByComma()}, extractToken(authorization))\n`
      result += `\t\t}\n`
      result += `\t}\n\n`

      // List
      result += `\t@GET\n`
      result += `\t@Path("/${table.modelName}")\n`
      result += `\t@ApiOperation(value = "List ${table.modelName} information")\n`
      result += `\tfun list${table.modelName}(\n`
      result += `\t\t@HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en-US, pt-BR")\n`
      result += `\t\t\tlang: String,\n`
      result += `\t\t@HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")\n`
      result += `\t\t\tclientVersion: String,\n`
      result += `\t\t@HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")\n`
      result += `\t\t\tauthorization: String,\n\n`
      result += `\t\t@QueryParam("query") @ApiParam(value = "Query of search")\n`
      result += `\t\t\tquery: String?,\n`
      result += `\t\t@QueryParam("page") @ApiParam(value = "Page index, null to not paginate")\n`
      result += `\t\t\tpage: Int?,\n`
      result += `\t\t@QueryParam("limit") @ApiParam(value = "Page size, null to not paginate")\n`
      result += `\t\t\tlimit: Int?,\n`
      result += `\t\t@QueryParam("orderBy") @ApiParam(value = "Identifier for sorting, usually a property name", example = "${table.idColumn.name}")\n`
      result += `\t\t\torderRequest: String?,\n`
      result += `\t\t@QueryParam("ascending") @ApiParam(value = "True for ascending order", defaultValue = "false")\n`
      result += `\t\t\tasc: Boolean?\n`
      result += `\t): PagedResp<${table.modelName}> {\n`
      result += `\t\t//TODO: review generated method\n`
      result += `\t\treturn pipe.handle {\n`
      result += `\t\t\tcon -> ${table.modelName}Process(con, getLang(lang), clientVersion)\n`
      result += `\t\t\t\t.list(extractToken(authorization), query, page, limit, orderRequest, asc != null && asc)\n`
      result += `\t\t}\n`
      result += `\t}\n\n`

      // Persist
      result += `\t@POST\n`
      result += `\t@Path("/${table.modelName}")\n`
      result += `\t@ApiOperation(value = "Persist a new or existing ${table.modelName}", notes = "1 - Informed ${table.modelName} have an ID editing the existing ${table.modelName}; 2 - Informed ${table.modelName} don't have an ID creating a new ${table.modelName}")\n`
      result += `\tfun persist${table.modelName}(\n`
      result += `\t\t@HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en-US, pt-BR")\n`
      result += `\t\t\tlang: String,\n`
      result += `\t\t@HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")\n`
      result += `\t\t\tclientVersion: String,\n`
      result += `\t\t@HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")\n`
      result += `\t\t\tauthorization: String,\n\n`
      result += `\t\t@ApiParam(required = true)\n`
      result += `\t\t\t${table.instanceName}: ${table.modelName}\n`
      result += `\t): Long {\n`
      result += `\t\t//TODO: review generated method\n`
      result += `\t\treturn pipe.handle<Long> {\n`
      result += `\t\t\tcon -> ${table.modelName}Process(con, getLang(lang), clientVersion)\n`
      result += `\t\t\t\t.persist(${table.instanceName}, extractToken(authorization))\n`
      result += `\t\t}\n`
      result += `\t}\n\n`

      if (table.isRemovable) {
        // Delete
        result += `\t@DELETE\n`
        result += `\t@Path("/${table.modelName}/${table.primariesBySlash()}")\n`
        result += `\t@ApiOperation(value = "Deletes the ${table.modelName} of informed id")\n`
        result += `\tfun remove${table.modelName}(\n`

        if (columns.length === 0) columns.push({})
        columns.forEach((column) => {
          const id = columns.length <= 1 ? 'id' : column.name
          result += `\t\t@PathParam("${id}") @ApiParam(required = true)\n`
          result += `\t\t\t${id}: ${column.kotlinType}${columns.length <= 1 ? '?' : ''},\n`
        })

        result += `\n\t\t@HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en-US, pt-BR")\n`
        result += `\t\t\tlang: String,\n`
        result += `\t\t@HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")\n`
        result += `\t\t\tclientVersion: String,\n`
        result += `\t\t@HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")\n`
        result += `\t\t\tauthorization: String\n`
        result += `\t): Any? {\n`
        result += `\t\t//TODO: review generated method\n`
        result += `\t\treturn pipe.handle<Any?> {\n`
        result += `\t\t\tcon -> ${table.modelName}Process(con, getLang(lang), clientVersion)\n`
        result += `\t\t\t\t.remove(${table.primariesByComma()}, extractToken(authorization))\n`
        result += `\t\t}\n`
        result += `\t}\n\n`
      }
    })

    return result
  }
}
