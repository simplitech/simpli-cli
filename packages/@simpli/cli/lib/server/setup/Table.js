const Column = require('./Column')
const Relation = require('./Relation')
const ModelBuild = require('./build/ModelBuild')
const RespModelBuild = require('./build/RespModelBuild')
const ProcessBuild = require('./build/ProcessBuild')
const DaoBuild = require('./build/DaoBuild')
const camelCase = require('lodash.camelcase')

module.exports = class Table {
  constructor (dataTable = {}) {
    this.name = null
    this.modelName = null
    this.instanceName = null
    this.isPivot = null
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

  get idColumn () {
    return this.columns.find((column) => column.isID) || new Column()
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

  get uniqueColumn () {
    const reservedWords = [
      'unique',
      'unico'
    ]
    return this.columns.find((column) => !!reservedWords.find((word) => word === column.name)) || new Column()
  }

  get validRelations () {
    return this.relations.filter((relation) => relation.isValid)
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

  get hasUnique () {
    const reservedWords = [
      'unique',
      'unico'
    ]
    return !!this.columns.find((column) => !!reservedWords.find((word) => word === column.name))
  }

  primariesBySlash () {
    const columns = this.primaryColumns
    if (columns.length === 0) columns.push(new Column())
    return columns.map((column) => columns.length <= 1 ? `{id}` : `{${column.name}}`).join('/')
  }

  primariesByComma (withType = false) {
    const columns = this.primaryColumns
    const type = withType ? `: ${columns.kotlinType}` : ''
    if (columns.length === 0) columns.push(new Column())
    return columns.map((column) => columns.length <= 1 ? `id` : `${column.name + type}`).join(', ')
  }

  primariesByWhere (different = false) {
    const columns = this.primaryColumns
    if (columns.length === 0) columns.push(new Column())
    return columns.map((column) => `AND ${column.name} ${different ? '<>' : '='} ?`).join(' ')
  }

  buildModel () {
    return new ModelBuild(this).build()
  }

  buildRespModel () {
    return new RespModelBuild(this).build()
  }

  buildProcess () {
    return new ProcessBuild(this).build()
  }

  buildDao () {
    return new DaoBuild(this).build()
  }
}
