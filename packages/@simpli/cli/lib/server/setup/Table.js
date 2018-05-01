const Column = require('./Column')
const Relation = require('./Relation')
const uniqBy = require('lodash.uniqby')
const camelCase = require('lodash.camelcase')
const startCase = require('lodash.startcase')

module.exports = class Table {
  constructor (dataTable = {}) {
    this.name = null
    this.modelName = null
    this.instanceName = null
    this.isPivot = null
    this.manyToMany = {
      pivotTableName: null,
      pivotModelName: null,
      pivotInstanceName: null,
      crossRelationTableName: null,
      crossRelationModelName: null,
      crossRelationInstanceName: null,
      crossRelationColumnName: null
    }
    this.columns = []
    this.relations = []

    this.setName(dataTable)
    this.setColumns(dataTable)
    this.setRelations(dataTable)
  }

  get foreignColumns () {
    return this.columns.filter((column) => column.isForeign)
  }

  get primaryColumns () {
    return this.columns.filter((column) => column.isPrimary)
  }

  get uniqueColumns () {
    return this.columns.filter((column) => column.isUnique)
  }

  get exceptPrimaryColumns () {
    return this.columns.filter((column) => !column.isPrimary)
  }

  get idColumn () {
    let column = this.columns.find((column) => column.isID)
    if (!column) {
      column = this.columns.find((column) => column.foreignColumns) || new Column()
    }
    return column
  }

  get removableColumn () {
    const reservedWords = [
      'active',
      'deleted',
      'softDeleted',
      'ativo'
    ]
    return this.columns.find((column) => !!reservedWords.find((word) => word === column.name)) || new Column()
  }

  get validRelations () {
    return this.relations.filter((relation) => relation.isValid)
  }

  get validDistinctRelations () {
    return uniqBy(this.validRelations, 'referencedTableName')
  }

  findColumnByName (name) {
    return this.columns.find((table) => table.name === name)
  }

  setName (dataTable = {}) {
    const capitalizeFirstLetter = (str = '') => str.charAt(0).toUpperCase() + str.slice(1)

    this.name = dataTable.tableName || null
    this.modelName = capitalizeFirstLetter(camelCase(this.name) || '')
    this.instanceName = camelCase(this.name)
  }

  setColumns (dataTable = {}) {
    this.columns = (dataTable.tableScheme || []).map((dataColumn) => new Column(dataColumn))
  }

  setRelations (dataTable = {}) {
    this.relations = (dataTable.tableRelations || []).map((dataRelation) => new Relation(dataRelation))
  }

  setPivot () {
    const countNonForeignColumns = this.columns.filter((column) => !column.isForeign).length
    const countForeignColumns = this.columns.filter((column) => column.isForeign).length
    this.isPivot = countNonForeignColumns === 0 && countForeignColumns >= 2
  }

  get isRemovable () {
    const reservedWords = [
      'active',
      'deleted',
      'softDeleted',
      'ativo'
    ]
    return !!this.columns.find((column) => !!reservedWords.find((word) => word === column.name))
  }

  get hasID () {
    return !!this.columns.find((column) => column.isID)
  }

  get hasPivot () {
    return !!this.relations.find((relation) => relation.isManyToMany)
  }

  primariesBySlash () {
    const columns = this.primaryColumns
    if (columns.length === 0) columns.push(new Column())
    return columns.map((column) => columns.length <= 1 ? `{id}` : `{${column.name}}`).join('/')
  }

  primariesByComma (completeId = false) {
    const columns = this.primaryColumns
    const printId = (name) => completeId ? name : 'id'
    if (columns.length === 0) columns.push(new Column())
    return columns.map((column) => columns.length <= 1 ? printId(column.name) : `${column.name}`).join(', ')
  }

  primariesByParam (forceNullable = false) {
    const columns = this.primaryColumns
    const qMark = (column) => column.isRequired && forceNullable ? '?' : ''
    if (columns.length === 0) columns.push(new Column())
    return columns.map((column) => `${column.name}: ${column.kotlinType + qMark(column)}`).join(', ')
  }

  primariesByConditions (opposite = false) {
    const columns = this.primaryColumns
    if (columns.length === 0) columns.push(new Column())
    return columns.map((column) => `${column.name} ${opposite ? '==' : '!='} null ${opposite ? '||' : '&&'} ${column.name} ${opposite ? '==' : '>'} 0L`).join(' && ')
  }

  primariesByWhere (different = false) {
    const columns = this.primaryColumns
    if (columns.length === 0) columns.push(new Column())
    return columns.map((column) => `AND ${column.name} ${different ? '<>' : '='} ?`).join(' ')
  }

  buildValidate () {
    let result = ''

    this.exceptPrimaryColumns.forEach((column) => {
      if (column.isLong && column.isRequired) {
        result += `\t\tif (${column.name} == 0L) {\n`
        result += `\t\t\tthrow HttpException(lang.cannotBeNull("${startCase(column.name)}"), Response.Status.NOT_ACCEPTABLE)\n`
        result += `\t\t}\n`
      } else if (column.isString && column.isRequired) {
        result += `\t\tif (${column.name}.isNullOrEmpty()) {\n`
        result += `\t\t\tthrow HttpException(lang.cannotBeNull("${startCase(column.name)}"), Response.Status.NOT_ACCEPTABLE)\n`
        result += `\t\t}\n`
        result += `\t\tif (${column.name}?.length ?: 0 > ${column.size}) {\n`
        result += `\t\t\tthrow HttpException(lang.lengthCannotBeMoreThan("${startCase(column.name)}", ${column.size}), Response.Status.NOT_ACCEPTABLE)\n`
        result += `\t\t}\n`
      } else if (column.isCpf) {
        result += `\t\tif (${column.name} == null && !Validator.isCPF(${column.name})) {\n`
        result += `\t\t\tthrow HttpException(lang.isNotAValidCPF("${startCase(column.name)}"), Response.Status.NOT_ACCEPTABLE)\n`
        result += `\t\t}\n`
      } else if (column.isCnpj) {
        result += `\t\tif (${column.name} == null && !Validator.isCNPJ(${column.name} ?: "")) {\n`
        result += `\t\t\tthrow HttpException(lang.isNotAValidCNPJ("${startCase(column.name)}"), Response.Status.NOT_ACCEPTABLE)\n`
        result += `\t\t}\n`
      } else if (column.isRequired) {
        result += `\t\tif (${column.name} == null) {\n`
        result += `\t\t\tthrow HttpException(lang.cannotBeNull("${startCase(column.name)}"), Response.Status.NOT_ACCEPTABLE)\n`
        result += `\t\t}\n`
      }
    })

    return result
  }

  buildBuildAll () {
    let result = ''

    result += `\t\t@Throws(SQLException::class)\n`
    result += `\t\t@JvmOverloads\n`
    result += `\t\tfun buildAll(rs: ResultSet, alias: String = "${this.name}"): ${this.modelName} {\n`
    result += `\t\t\tval ${this.instanceName} = ${this.modelName}()\n\n`
    this.columns.forEach((column) => {
      if (column.isLong) {
        result += `\t\t\t${this.instanceName}.${column.name} = rs.getLong${column.isRequired ? '' : 'OrNull'}(alias, "${column.name}")\n`
      } else if (column.isDouble) {
        result += `\t\t\t${this.instanceName}.${column.name} = rs.getDouble${column.isRequired ? '' : 'OrNull'}(alias, "${column.name}")\n`
      } else if (column.isString) {
        result += `\t\t\t${this.instanceName}.${column.name} = rs.getString(alias, "${column.name}")\n`
      } else if (column.isBoolean) {
        result += `\t\t\t${this.instanceName}.${column.name} = rs.getBoolean${column.isRequired ? '' : 'OrNull'}(alias, "${column.name}")\n`
      } else if (column.isDate) {
        result += `\t\t\t${this.instanceName}.${column.name} = rs.getTimestamp(alias, "${column.name}")\n`
      }
    })
    result += `\n\t\t\treturn ${this.instanceName}\n`
    result += `\t\t}\n`

    return result
  }
}
