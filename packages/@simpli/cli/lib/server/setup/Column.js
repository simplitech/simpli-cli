module.exports = class Column {
  constructor (dataColumn = {}) {
    this.field = dataColumn.Field || null
    this.type = dataColumn.Type || null
    this.keyType = dataColumn.Key || null
    this.nullable = dataColumn.Null || null
    this.default = dataColumn.Default || null
    this.extra = dataColumn.Extra || null
    this.foreign = null // Relation class
  }

  defineAsObject (foreignName) {
  }

  get name () {
    return this.field
  }

  get kotlinType () {
    const type = this.type || ''
    if ((type.match(/^VARCHAR|TEXT(?:\(\d+\))*$/gi))) return 'String'
    if ((type.match(/^INT(?:\(\d+\))*$/gi))) return 'Long'
    if ((type.match(/^DOUBLE(?:\(\d+\))*$/gi))) return 'Double'
    if ((type.match(/^TINYINT(?:\(\d+\))*$/gi))) return 'Boolean'
    if ((type.match(/^DATE|DATETIME(?:\(\d+\))*$/gi))) return 'Date'
    return 'String'
  }

  get size () {
    const type = this.type || ''
    const match = type.match(/^\w+(?:\((\d+)\))*$/gi)
    if (match) return Number(match[0])
    return null
  }

  get isString () {
    return this.kotlinType === 'String'
  }

  get isStringTextarea () {
    const type = this.type || ''
    return !!type.match(/TEXT(?:\(\d+\))*/gi)
  }

  get isLong () {
    return this.kotlinType === 'Long'
  }

  get isDouble () {
    return this.kotlinType === 'Double'
  }

  get isBoolean () {
    return this.kotlinType === 'Boolean'
  }

  get isDate () {
    return this.kotlinType === 'Date'
  }

  get isAutoIncrement () {
    return this.extra === 'auto_increment'
  }

  get isID () {
    return !!(this.keyType === 'PRI' && this.isAutoIncrement)
  }

  get isPrimary () {
    return this.keyType === 'PRI'
  }

  get isForeign () {
    return !!this.foreign
  }

  get isRequired () {
    return this.nullable === 'NO'
  }

  get isPassword () {
    const reservedWords = [
      'password',
      'senha'
    ]
    return !!reservedWords.find((word) => word === this.name)
  }

  get isUpdatedAt () {
    const reservedWords = [
      'updatedAt',
      'dateUpdated',
      'dataAlteracao'
    ]
    return !!reservedWords.find((word) => word === this.name)
  }

  get isCreatedAt () {
    const reservedWords = [
      'createdAt',
      'dateCreated',
      'dataCriacao'
    ]
    return !!reservedWords.find((word) => word === this.name)
  }
}
