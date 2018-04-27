const camelCase = require('lodash.camelcase')

module.exports = class Relation {
  constructor (dataRelation = {}) {
    this.name = null
    this.isValid = true
    this.tableName = dataRelation.TABLE_NAME || null
    this.tableModelName = null
    this.columnName = dataRelation.COLUMN_NAME || null
    this.columnNullable = null
    this.constraintName = dataRelation.CONSTRAINT_NAME || null
    this.referencedTableName = dataRelation.REFERENCED_TABLE_NAME || null
    this.referencedTableModelName = null
    this.referencedColumnName = dataRelation.REFERENCED_COLUMN_NAME || null

    this.isManyToMany = false
    this.pivot = {
      tableName: null,
      tableModelName: null
    }

    this.setName()
  }

  setName () {
    const match = (this.columnName || '').match(/[^\sid|_]([\w]+)[^_|fk\s]/gi)
    if (match) {
      this.name = camelCase(match[0])
    } else this.isValid = false
  }

  get isRequired () {
    return this.columnNullable === 'NO'
  }
}
