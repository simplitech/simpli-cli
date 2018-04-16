module.exports = class Attr {
  constructor (name, belongsTo, prop) {
    this.name = name || ''
    this.belongsTo = belongsTo
    this.default = prop.default !== undefined ? prop.default : null
    this.type = prop.type
    this.isArray = false
    this.isObject = false
    this.isRequired = false

    this.setType(prop)
  }

  setType (entry) {
    if (this.name.match(/^(id)\w+(Pk)$/)) {
      this.type = 'ID'
    } else if (this.name.match(/^(id)\w+(Fk)$/)) {
      this.type = 'foreign'
    } else if (this.isTAG() && !entry.$ref) {
      this.type = 'TAG'
    } else if (this.isEmail() && !entry.$ref) {
      this.type = 'email'
    } else if (this.isPassword() && !entry.$ref) {
      this.type = 'password'
    } else if (entry.type === 'number') {
      if (entry.format === 'double') this.type = 'double'
      else this.type = 'integer'
    } else if (entry.type === 'string') {
      if (entry.format === 'date-time') this.type = 'datetime'
    } else if (entry.type === 'array') {
      this.isArray = true
      this.isObject = false
      this.type = entry.items && entry.items.$ref && entry.items.$ref.match(/[^\/]+(?=\/$|$)/)[0]
    } else if (entry.type === 'object' || entry.$ref) {
      this.isArray = false
      this.isObject = true
      this.type = entry.$ref && entry.$ref.match(/[^\/]+(?=\/$|$)/)[0]
    }
  }

  // Type Primary
  isID () { return this.isPrimaryOrigin() && this.type === 'id' }
  isForeign () { return this.isPrimaryOrigin() && this.type === 'foreign' }
  isString () { return this.isPrimaryOrigin() && this.type === 'string' }
  isInteger () { return this.isPrimaryOrigin() && this.type === 'integer' }
  isDouble () { return this.isPrimaryOrigin() && this.type === 'double' }
  isBoolean () { return this.isPrimaryOrigin() && this.type === 'boolean' }
  isDate () { return this.isPrimaryOrigin() && this.type === 'date' }
  isDatetime () { return this.isPrimaryOrigin() && this.type === 'datetime' }

  // Type Origin
  isPrimaryOrigin () { return this.typeOrigin() === 'primary' }
  isArrayOrigin () { return this.typeOrigin() === 'array' }
  isObjectOrigin () { return this.typeOrigin() === 'object' }

  typeOrigin () {
    if (!this.isArray && !this.isObject) {
      return 'primary'
    } else if (this.isArray && !this.isObject) {
      return 'array'
    } else if (!this.isArray && this.isObject) {
      return 'object'
    }
    throw new Error(`The attribute '${this.name}' in '${this.belongsTo}' is both array and object`)
  }

  isTAG () {
    const reservedWords = [
      'tag',
      'label',
      'title',
      'name',
      'titulo',
      'nome'
    ]
    return !!reservedWords.find((word) => word === this.name)
  }

  isEmail () {
    const reservedWords = [
      'email',
      'e-mail',
      'mail'
    ]
    return !!reservedWords.find((word) => word === this.name)
  }

  isPassword () {
    const reservedWords = [
      'password',
      'senha'
    ]
    return !!reservedWords.find((word) => word === this.name)
  }

  validations () {
    const result = []

    if (this.isRequired) {
      result.push({
        title: 'ValidationRequired',
        attr: []
      })
    }

    if (this.isString()) {
      result.push({
        title: 'MaxLength',
        attr: [255]
      })
    }

    if (this.isEmail()) {
      result.push({
        title: 'ValidationEmail',
        attr: []
      })
    }

    if (this.isPassword()) {
      result.push({
        title: 'ValidationPasswordLength',
        attr: [6, 31]
      })
      result.push({
        title: 'ResponseHidden',
        attr: []
      })
    }

    return result
  }
}
