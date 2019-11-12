const Column = require('./Column')
const Relation = require('./Relation')
const uniqBy = require('lodash.uniqby')
const camelCase = require('lodash.camelcase')
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

  get exceptPasswordColumns () {
    return this.columns.filter((column) => !column.isPassword)
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

  get descriptionColumns () {
    return this.columns.filter((column) => column.description)
  }

  get requiredAndNotDescriptionColumns () {
    return this.columns.filter((column) => column.isRequired && !column.description)
  }

  get maxlengthAndNotRequiredAndNotDescriptionColumns () {
    return this.columns.filter((column) => column.hasMaxlength && !column.isRequired && !column.description)
  }

  get simpleColumns () {
    return this.columns.filter((column) => !column.hasMaxlength && !column.isRequired && !column.description)
  }

  get passwordColumns () {
    return this.columns.filter((column) => column.isPassword)
  }

  get hasUniqueDefaultId () {
    const columns = this.idsColumn
    if (columns.length === 1) {
      return columns[0].kotlinType === 'Long'
    }
    return false
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

  primariesByParam (forceNullable = false, simpleId = false) {
    const columns = this.idsColumn
    const qMark = (column) => column.isRequired && forceNullable ? '?' : ''
    if (columns.length === 0) columns.push(new Column())
    if (simpleId) {
      return columns.map((column, index) => `id${columns.length === 1 ? '' : (index + 1)}: ${column.kotlinType + qMark(column)}`).join(', ')
    }
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

  primariesByWhere (different = false, instanceName = '') {
    const columns = this.idsColumn
    if (columns.length === 0) columns.push(new Column())
    if (instanceName) {
      const printId = (name, index) => `${instanceName}.id${(Number(index) + 1) || ''}`
      return columns.map((column, index) => {
        const attr = columns.length <= 1 ? printId(column.name) : printId(column.name, index)
        return `.where${different ? 'Not' : ''}Eq("${column.field}", ${attr})`
      }).join('\n                ')
    }
    return columns.map((column) => `.where${different ? 'Not' : ''}Eq("${column.field}", ${column.name})`).join('\n                ')
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

  buildValidate () {
    let result = '        // TODO: review generated method\n'

    if (!this.hasID) {
      this.foreignColumns.forEach((column) => {
        result += `        if (${column.name} == 0L) {\n`
        result += `            throw BadRequestException(lang.cannotBeNull(lang["${this.modelName}.${column.name}"]))\n`
        result += `        }\n`
      })
    }
    this.exceptPrimaryColumns.forEach((column) => {
      if (column.isLong && column.isRequired) {
        result += `        if (${column.name} == 0L) {\n`
        result += `            throw BadRequestException(lang.cannotBeNull(lang["${this.modelName}.${column.name}"]))\n`
        result += `        }\n`
      } else if (column.isString) {
        if (column.isRequired) {
          result += `        if (${column.name}.isNullOrBlank()) {\n`
          result += `            throw BadRequestException(lang.cannotBeNull(lang["${this.modelName}.${column.name}"]))\n`
          result += `        }\n`
        }
        if (column.size) {
          result += `        if (${column.name}?.length ?: 0 > ${column.size}) {\n`
          result += `            throw BadRequestException(lang.lengthCannotBeMoreThan(lang["${this.modelName}.${column.name}"], ${column.size}))\n`
          result += `        }\n`
        }
        if (column.isEmail) {
          result += `        if (${column.name} != null && !Validator.isEmail(${column.name})) {\n`
          result += `            throw BadRequestException(lang.isNotAValidEmail(lang["${this.modelName}.${column.name}"]))\n`
          result += `        }\n`
        } else if (column.isCpf) {
          result += `        if (${column.name} != null && !Validator.isCPF(${column.name})) {\n`
          result += `            throw BadRequestException(lang.isNotAValidCPF(lang["${this.modelName}.${column.name}"]))\n`
          result += `        }\n`
        } else if (column.isCnpj) {
          result += `        if (${column.name} != null && !Validator.isCNPJ(${column.name} ?: "")) {\n`
          result += `            throw BadRequestException(lang.isNotAValidCNPJ(lang["${this.modelName}.${column.name}"]))\n`
          result += `        }\n`
        }
      } else if (column.isRequired && !column.isBoolean && !column.isDouble) {
        result += `        if (${column.name} == null) {\n`
        result += `            throw BadRequestException(lang.cannotBeNull(lang["${this.modelName}.${column.name}"]))\n`
        result += `        }\n`
      }
    })

    return result
  }

  buildRequiredPathId () {
    let result = ''

    if (!this.hasUniqueDefaultId) {
      result += `    open class RequiredPathId : DefaultParam.Auth() {\n`
      if (!this.idsColumn.length) {
        result += `        @PathParam("id")\n`
        result += `        @Schema(required = true)\n`
        result += `        var id: Long? = null\n`
      } else if (!this.idsColumn.length === 1) {
        result += `        @PathParam("id")\n`
        result += `        @Schema(required = true)\n`
        result += `        var id: ${this.idColumn.kotlinType}? = null\n`
      } else {
        this.idsColumn.forEach((column, i) => {
          result += `        @PathParam("id${i + 1}")\n`
          result += `        @Schema(required = true)\n`
          result += `        var id${i + 1}: ${column.kotlinType}? = null\n\n`
        })
        result = result.slice(0, -1) // remove last line
      }
      result += `    }\n\n`
    }

    return result
  }

  buildConstructor () {
    let result = ''

    result += `    constructor(rs: ResultSet, alias: String = "${this.name}") : this() {\n`
    this.columns.forEach((column) => {
      if (column.isLong) {
        result += `        ${column.name} = rs.getLong${column.isRequired ? '' : 'OrNull'}(alias, "${column.field}")\n`
      } else if (column.isDouble) {
        result += `        ${column.name} = rs.getDouble${column.isRequired ? '' : 'OrNull'}(alias, "${column.field}")\n`
      } else if (column.isString) {
        result += `        ${column.name} = rs.getString(alias, "${column.field}")\n`
      } else if (column.isBoolean) {
        result += `        ${column.name} = rs.getBoolean${column.isRequired ? '' : 'OrNull'}(alias, "${column.field}")\n`
      } else if (column.isDate) {
        result += `        ${column.name} = rs.getTimestamp(alias, "${column.field}")\n`
      }
    })
    result += `    }\n`

    return result
  }

  buildUpdateApplyModel () {
    let result = ''

    result += `        model.apply {\n`
    this.exceptIDColumns.forEach((column) => {
      if (column.isSoftDelete) {
        result += `            ${column.field} = true\n`
      } else if (column.isUpdatedAt) {
        result += `            ${column.field} = Date()\n`
      }
    })
    result += `            validate(context.lang)`
    result += `\n        }\n`

    return result
  }

  buildUpdateSet () {
    let result = ''

    result += `    fun updateSet() = mapOf(\n`
    this.exceptIDColumns.forEach((column) => {
      if (column.isPassword) {
        result += `            "${column.field}" to Query("IF(? IS NOT NULL, SHA2(?, 256), ${column.field})", ${column.name}, ${column.name}),\n`
      } else if (!column.isCreatedAt) {
        result += `            "${column.field}" to ${column.name},\n`
      }
    })
    result = result.slice(0, -2) // remove last line and comma
    result += `\n    )\n`

    return result
  }

  buildCreateApplyModel () {
    let result = ''

    result += `        model.apply {\n`
    this.exceptIDColumns.forEach((column) => {
      if (column.isSoftDelete) {
        result += `            ${column.field} = true\n`
      } else if (column.isCreatedAt) {
        result += `            ${column.field} = Date()\n`
      }
    })
    result += `            validate(context.lang)`
    result += `\n        }\n`

    return result
  }

  buildInsertValues () {
    let result = ''

    result += `    fun insertValues() = mapOf(\n`
    this.exceptAutoIncrementColumns.forEach((column) => {
      if (column.isPassword) {
        result += `            "${column.field}" to Query("SHA2(?, 256)", ${column.name}),\n`
      } else if (!column.isUpdatedAt) {
        result += `            "${column.field}" to ${column.name},\n`
      }
    })
    result = result.slice(0, -2) // remove last line and comma
    result += `\n    )\n`

    return result
  }

  buildOrderMap () {
    let result = ''

    result += `        val orderMap = mapOf(\n`
    this.exceptPasswordColumns.forEach((column) => {
      result += `                "${column.name}" to "${this.name}.${column.field}",\n`
    })
    result = result.slice(0, -2) // remove last line and comma
    result += `\n        )\n`

    return result
  }

  buildIdsColumns () {
    let result = ''

    this.idsColumn.forEach((column) => {
      result += column.build()
    })

    if (result) {
      result += '\n'
    }

    return result
  }

  buildRelations () {
    let result = ''

    this.validRelations.forEach((relation) => {
      result += relation.build()
    })

    if (result) {
      result += '\n'
    }

    return result
  }

  buildDescriptionsColumns () {
    let result = ''

    this.descriptionColumns.forEach((column) => {
      if (!column.isPrimary && !column.isForeign && !column.isPassword) {
        result += column.build()
      }
    })

    return result
  }

  buildRequiredAndNotDescriptionColumns () {
    let result = ''

    this.requiredAndNotDescriptionColumns.forEach((column) => {
      if (!column.isPrimary && !column.isForeign && !column.isPassword) {
        result += column.build()
      }
    })

    if (result) {
      result += '\n'
    }

    return result
  }

  buildMaxlengthAndNotRequiredAndNotDescriptionColumns () {
    let result = ''

    this.maxlengthAndNotRequiredAndNotDescriptionColumns.forEach((column) => {
      if (!column.isPrimary && !column.isForeign && !column.isPassword) {
        result += column.build()
      }
    })

    if (result) {
      result += '\n'
    }

    return result
  }

  buildSimpleColumns () {
    let result = ''

    this.simpleColumns.forEach((column) => {
      if (!column.isPrimary && !column.isForeign && !column.isPassword) {
        result += column.build()
      }
    })

    if (result) {
      result += '\n'
    }

    return result
  }

  buildPasswordColumns () {
    let result = ''

    this.passwordColumns.forEach((column) => {
      if (!column.isPrimary && !column.isForeign) {
        result += column.build()
      }
    })

    if (result) {
      result += '\n'
    }

    return result
  }

  buildGettersAndSetters () {
    let result = ''

    if (!this.idsColumn.length && !this.hasIDColumnAsFieldName()) {
      result += `    var id\n`
      result += `        @Schema(hidden = true)\n`
      result += `        get() = 0\n`
      result += `        set(value) {\n`
      result += `            // TODO: identify the id property\n`
      result += `        }\n\n`
    }

    this.idsColumn.forEach((column, i) => {
      if (this.idsColumn.length === 1) {
        if (!this.hasIDColumnAsFieldName()) {
          result += `    var id\n`
          result += `        @Schema(hidden = true)\n`
          result += `        get() = ${column.name}\n`
          result += `        set(value) {\n`
          result += `            ${column.name} = value\n`
          result += `        }\n\n`
        }
      } else {
        if (!this.hasIDColumnAsFieldName(i + 1)) {
          result += `    var id${i + 1}\n`
          result += `        @Schema(hidden = true)\n`
          result += `        get() = ${column.name}\n`
          result += `        set(value) {\n`
          result += `            ${column.name} = value\n`
          result += `        }\n\n`
        }
      }
    })

    this.foreignColumns.forEach((column) => {
      if (!column.isPrimary) {
        result += column.buildForeign()
      }
    })

    return result
  }
}
