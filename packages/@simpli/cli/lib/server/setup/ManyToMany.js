module.exports = class ManyToMany {
  constructor () {
    this.pivotTableName = null
    this.pivotModelName = null
    this.pivotInstanceName = null
    this.crossRelationTableName = null
    this.crossRelationModelName = null
    this.crossRelationInstanceName = null
    this.crossRelationColumnName = null
  }
}
