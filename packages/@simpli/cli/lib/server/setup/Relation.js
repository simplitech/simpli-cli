const camelCase = require('lodash.camelcase')

module.exports = class Relation {
  constructor (dataRelation = {}) {
    this.name = camelCase(dataRelation.REFERENCED_TABLE_NAME)
    this.isValid = true
    this.tableName = dataRelation.TABLE_NAME || null
    this.tableModelName = null
    this.columnName = dataRelation.COLUMN_NAME || null
    this.columnNullable = null
    this.constraintName = dataRelation.CONSTRAINT_NAME || null
    this.referencedTableName = dataRelation.REFERENCED_TABLE_NAME || null
    this.referencedTableAlias = dataRelation.REFERENCED_TABLE_NAME || null
    this.referencedTableInstanceName = null
    this.referencedTableModelName = null
    this.referencedColumnName = dataRelation.REFERENCED_COLUMN_NAME || null

    this.isManyToMany = false
    this.pivot = {
      name: null,
      tableName: null,
      tableModelName: null
    }
  }

  get capitalizedName () {
    const capitalizeFirstLetter = (str = '') => {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
    return capitalizeFirstLetter(this.name)
  }

  get isRequired () {
    return this.columnNullable === 'NO'
  }

  build () {
    let result = ''
    if (this.isManyToMany) {
      result += `    var ${this.name}: MutableList<${this.referencedTableModelName}>? = null\n`
    } else {
      result += `    var ${this.name}: ${this.referencedTableModelName}? = null\n`
    }
    return result
  }
}
