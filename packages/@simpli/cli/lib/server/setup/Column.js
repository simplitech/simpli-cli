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

  get qMark () {
    if (!this.isRequired) return '?'
    if (this.isID) return ''
    if (this.isLong) return ''
    if (this.isDouble) return ''
    if (this.isBoolean) return ''
    return '?'
  }

  get defaultValue () {
    if (!this.isRequired) return 'null'
    if (this.isID) return '0'
    if (this.isLong) return '0'
    if (this.isDouble) return '0.0'
    if (this.isBoolean) return 'false'
    return 'null'
  }

  get size () {
    const type = this.type || ''
    const pattern = /^\w+(?:\((\d+)\))*$/gi
    const match = pattern.exec(type)
    if (match) return match[1]
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

  get isUnique () {
    return this.keyType === 'UNI'
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

  get isCpf () {
    const reservedWords = ['cpf']
    return !!reservedWords.find((word) => word === this.name)
  }

  get isCnpj () {
    const reservedWords = ['cnpj']
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