const Column = require('./Column')
const Relation = require('./Relation')
const uniqBy = require('lodash.uniqby')
const camelCase = require('lodash.camelcase')
const startCase = require('lodash.startcase')
const kebabCase = require('lodash.kebabcase')

module.exports = class Table {
  constructor (dataTable = {}) {
    this.name = null // table name (e.g. my_table)
    this.commentary = null // table main commentary
    this.modelName = null // model name of the table (e.g. MyTable)
    this.instanceName = null // (alias of camelCase) instance name of the model (e.g. myTable)
    this.apiName = null // (alias of kebab-case) API name of the model (e.g. my-table)
    this.isPivot = null
    this.columns = []
    this.relations = []
    this.manyToMany = []

    this.setName(dataTable)
    this.setCommentary(dataTable)
    this.setColumns(dataTable)
    this.setRelations(dataTable)
  }

  get foreignColumns () {
    return this.columns.filter((column) => column.isForeign)
  }

  get primaryColumns () {
    return this.columns.filter((column) => column.isPrimary)
  }

  get requiredColumns () {
    return this.columns.filter((column) => column.isRequired)
  }

  get uniqueColumns () {
    return this.columns.filter((column) => column.isUnique)
  }

  get queryColumns () {
    return this.columns.filter((column) => (column.isID || column.isString) && !column.isPassword && !column.isUrl && !column.isImageUrl)
  }

  get softDeleteColumns () {
    return this.columns.filter((column) => column.isSoftDelete)
  }

  get exceptPrimaryColumns () {
    return this.columns.filter((column) => !column.isPrimary)
  }

  get exceptIDColumns () {
    return this.columns.filter((column) => !column.isID)
  }

  get exceptAutoIncrementColumns () {
    return this.columns.filter((column) => !column.isAutoIncrement)
  }

  get idColumn () {
    let column = this.columns.find((column) => column.isID)
    if (!column) {
      column = this.columns.find((column) => column.isForeign) || new Column()
    }
    return column || new Column()
  }

  get idsColumn () {
    let column = this.columns.filter((column) => column.isPrimary)
    if (!column) {
      column = this.columns.filter((column) => column.isForeign) || new Column()
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

  hasIDColumnAsFieldName (index) {
    return !!this.columns.find((column) => (column.field || '').toLowerCase() === `id${index || ''}`)
  }

  findColumnByName (name) {
    return this.columns.find((table) => table.name === name)
  }

  findManyToManyByPivotTableName (tableName) {
    return this.manyToMany.find((m2m) => m2m.pivotTableName === tableName)
  }

  setName (dataTable = {}) {
    const capitalizeFirstLetter = (str = '') => str.charAt(0).toUpperCase() + str.slice(1)

    this.name = dataTable.tableName || null
    this.modelName = capitalizeFirstLetter(camelCase(this.name) || '')
    this.instanceName = camelCase(this.name)
    this.apiName = kebabCase(this.name)
  }

  setCommentary (dataTable = {}) {
    this.commentary = dataTable.tableCommentary || null
  }

  setColumns (dataTable = {}) {
    this.columns = (dataTable.tableScheme || []).map((dataColumn) => new Column(dataColumn))
  }

  setRelations (dataTable = {}) {
    const relations = (dataTable.tableRelations || []).map((dataRelation) => new Relation(dataRelation))
    this.relations = uniqBy(relations, 'constraintName')
  }

  setPivot () {
    const countNonForeignColumns = this.columns.filter((column) => !column.isForeign && !column.isID).length
    const countForeignColumns = this.columns.filter((column) => column.isForeign).length
    this.isPivot = countNonForeignColumns === 0 && countForeignColumns === 2
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

  get hasPersist () {
    return !!(this.hasID || this.foreignColumns.length)
  }

  get hasID () {
    return !!this.columns.find((column) => column.isID)
  }

  get hasPivot () {
    return !!this.relations.find((relation) => relation.isManyToMany)
  }

  get hasUnique () {
    return !!this.columns.find((column) => column.isUnique)
  }

  primariesBySlash () {
    const columns = this.idsColumn
    if (columns.length === 0) columns.push(new Column())
    return columns.map((column, index) => columns.length <= 1 ? `/{id}` : `/{id${index + 1}}`).join('')
  }

  primariesByComma (completeId = false) {
    const columns = this.idsColumn
    const printId = (name, index) => completeId ? name : `id${(Number(index) + 1) || ''}`
    if (columns.length === 0) columns.push(new Column())
    return columns.map((column, index) => columns.length <= 1 ? printId(column.name) : printId(column.name, index)).join(', ')
  }

  primariesByParam (forceNullable = false) {
    const columns = this.idsColumn
    const qMark = (column) => column.isRequired && forceNullable ? '?' : ''
    if (columns.length === 0) columns.push(new Column())
    return columns.map((column) => `${column.name}: ${column.kotlinType + qMark(column)}`).join(', ')
  }

  primariesByParamCall (prefix = '') {
    const columns = this.idsColumn
    const dot = prefix ? '.' : ''
    if (columns.length === 0) columns.push(new Column())
    return columns.map((column, index) => `${prefix}${dot}id${columns.length === 1 ? '' : (index + 1)}`).join(', ')
  }

  primariesByConditions (opposite = false) {
    const columns = this.idsColumn
    if (columns.length === 0) columns.push(new Column())
    return columns.map((column) => {
      if (column.isString) return `${column.name} ${opposite ? '==' : '!='} null ${opposite ? '||' : '&&'} ${opposite ? '' : '!'}${column.name}.isEmpty()`
      return `${column.name} ${opposite ? '==' : '!='} null ${opposite ? '||' : '&&'} ${column.name} ${opposite ? '==' : '>'} 0L`
    }).join(' && ')
  }

  primariesByWhere (different = false) {
    const columns = this.idsColumn
    if (columns.length === 0) columns.push(new Column())
    return columns.map((column) => `AND ${column.field} ${different ? '<>' : '='} ?`).join(' ')
  }

  primariesTestValuesByParam () {
    const columns = this.idsColumn
    if (columns.length === 0) columns.push(new Column())
    return columns.map((column) => {
      if (column.isString) return `\"1\"`
      return `1L`
    }).join(', ')
  }

  get daoModels () {
    const instances = [{
      name: this.instanceName,
      modelName: this.modelName
    }]

    this.validRelations.forEach((relation) => {
      if (!relation.isManyToMany) {
        instances.push({
          name: relation.referencedTableInstanceName,
          modelName: relation.referencedTableModelName
        })
      } else {
        instances.push({
          name: relation.pivot.name,
          modelName: relation.pivot.tableModelName
        })
      }
    })

    this.manyToMany.forEach((m2m) => {
      instances.push({
        name: m2m.crossRelationInstanceName,
        modelName: m2m.crossRelationModelName
      })
    })

    return uniqBy(instances, 'modelName')
  }

  buildDaoUpdateQuery () {
    let result = ''

    this.exceptIDColumns.forEach((column) => {
      if (column.isPassword) {
        result += `\t\t\t${column.field} = IF(? IS NOT NULL, SHA2(?, 256), ${column.field}),\n`
      } else if (column.isUpdatedAt) {
        result += `\t\t\t${column.field} = NOW(),\n`
      } else if (!column.isCreatedAt) {
        result += `\t\t\t${column.field} = ?,\n`
      }
    })

    result = result.slice(0, -2) // remove last line
    result += `\n`

    return result
  }

  buildDaoUpdateParams () {
    let result = ''

    this.exceptIDColumns.forEach((column) => {
      if (column.isPassword) {
        result += `\t\t\t${this.instanceName}.${column.name}, ${this.instanceName}.${column.name},\n`
      } else if (column.isUpdatedAt) {
      } else if (!column.isCreatedAt) {
        result += `\t\t\t${this.instanceName}.${column.name},\n`
      }
    })

    this.idsColumn.forEach((column) => {
      result += `\t\t\t${this.instanceName}.${column.name},\n`
    })

    result = result.slice(0, -2) // remove last line and comma
    result += `\n`

    return result
  }

  buildDaoInsertQuery () {
    let result = ''

    this.exceptAutoIncrementColumns.forEach((column) => {
      if (!column.isUpdatedAt) {
        result += `\t\t\t${column.field},\n`
      }
    })

    result = result.slice(0, -2) // remove last line and comma
    result += `\n`

    return result
  }

  buildDaoInsertValues () {
    let result = ''

    this.exceptAutoIncrementColumns.forEach((column) => {
      if (column.isPassword) {
        result += `SHA2(?, 256),`
      } else if (column.isCreatedAt) {
        result += `NOW(),`
      } else if (!column.isUpdatedAt) {
        result += `?,`
      }
    })

    result = result.slice(0, -1) // remove last comma

    return result
  }

  buildDaoInsertParams () {
    let result = ''

    this.exceptAutoIncrementColumns.forEach((column) => {
      if (column.isCreatedAt) {
      } else if (!column.isUpdatedAt) {
        result += `\t\t\t${this.instanceName}.${column.name},\n`
      }
    })

    result = result.slice(0, -2) // remove last line and comma
    result += `\n`

    return result
  }

  buildValidate () {
    let result = ''

    if (!this.hasID) {
      this.foreignColumns.forEach((column) => {
        result += `\t\tif (${column.name} == 0L) {\n`
        result += `\t\t\tthrow BadRequestException(lang.cannotBeNull("${startCase(column.name)}"))\n`
        result += `\t\t}\n`
      })
    }
    this.exceptPrimaryColumns.forEach((column) => {
      if (column.isLong && column.isRequired) {
        result += `\t\tif (${column.name} == 0L) {\n`
        result += `\t\t\tthrow BadRequestException(lang.cannotBeNull("${startCase(column.name)}"))\n`
        result += `\t\t}\n`
      } else if (column.isString) {
        if (column.isRequired) {
          result += `\t\tif (${column.name}.isNullOrEmpty()) {\n`
          result += `\t\t\tthrow BadRequestException(lang.cannotBeNull("${startCase(column.name)}"))\n`
          result += `\t\t}\n`
        }
        if (column.size) {
          result += `\t\tif (${column.name}?.length ?: 0 > ${column.size}) {\n`
          result += `\t\t\tthrow BadRequestException(lang.lengthCannotBeMoreThan("${startCase(column.name)}", ${column.size}))\n`
          result += `\t\t}\n`
        }
        if (column.isEmail) {
          result += `\t\tif (${column.name} != null && !Validator.isEmail(${column.name})) {\n`
          result += `\t\t\tthrow BadRequestException(lang.isNotAValidEmail("${startCase(column.name)}"))\n`
          result += `\t\t}\n`
        } else if (column.isCpf) {
          result += `\t\tif (${column.name} != null && !Validator.isCPF(${column.name})) {\n`
          result += `\t\t\tthrow BadRequestException(lang.isNotAValidCPF("${startCase(column.name)}"))\n`
          result += `\t\t}\n`
        } else if (column.isCnpj) {
          result += `\t\tif (${column.name} != null && !Validator.isCNPJ(${column.name} ?: "")) {\n`
          result += `\t\t\tthrow BadRequestException(lang.isNotAValidCNPJ("${startCase(column.name)}"))\n`
          result += `\t\t}\n`
        }
      } else if (column.isRequired && !column.isBoolean && !column.isDouble) {
        result += `\t\tif (${column.name} == null) {\n`
        result += `\t\t\tthrow BadRequestException(lang.cannotBeNull("${startCase(column.name)}"))\n`
        result += `\t\t}\n`
      }
    })

    return result
  }

  buildConstructor () {
    let result = ''

    result += `\t@Throws(SQLException::class)\n`
    result += `\tconstructor(rs: ResultSet, alias: String = "${this.name}") {\n`
    this.columns.forEach((column) => {
      if (column.isLong) {
        result += `\t\t${column.name} = rs.getLong${column.isRequired ? '' : 'OrNull'}(alias, "${column.field}")\n`
      } else if (column.isDouble) {
        result += `\t\t${column.name} = rs.getDouble${column.isRequired ? '' : 'OrNull'}(alias, "${column.field}")\n`
      } else if (column.isString) {
        if (column.isRequired) {
          result += `\t\t${column.name} = rs.getString(alias, "${column.field}").toString()\n`
        } else {
          result += `\t\t${column.name} = rs.getString(alias, "${column.field}")\n`
        }
      } else if (column.isBoolean) {
        result += `\t\t${column.name} = rs.getBoolean${column.isRequired ? '' : 'OrNull'}(alias, "${column.field}")\n`
      } else if (column.isDate) {
        result += `\t\t${column.name} = rs.getTimestamp(alias, "${column.field}")\n`
      }
    })
    result += `\t}\n`

    return result
  }
}
