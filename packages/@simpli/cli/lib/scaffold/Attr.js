module.exports = class Attr {
  constructor (name, belongsTo, prop) {
    this.name = name || ''
    this.belongsTo = belongsTo
    this.default = prop.default !== undefined ? prop.default : null
    this.type = prop.type
    this.foreign = null
    this.foreignType = null
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
    } else if (this.isTAG && !entry.$ref) {
      this.type = 'TAG'
    } else if (this.isEmail && !entry.$ref) {
      this.type = 'email'
    } else if (this.isPassword && !entry.$ref) {
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
  get isID () { return this.isPrimaryOrigin && this.type === 'id' }
  get isForeign () { return this.isPrimaryOrigin && this.type === 'foreign' }
  get isString () { return this.isPrimaryOrigin && this.type === 'string' }
  get isInteger () { return this.isPrimaryOrigin && this.type === 'integer' }
  get isDouble () { return this.isPrimaryOrigin && this.type === 'double' }
  get isBoolean () { return this.isPrimaryOrigin && this.type === 'boolean' }
  get isDate () { return this.isPrimaryOrigin && this.type === 'date' }
  get isDatetime () { return this.isPrimaryOrigin && this.type === 'datetime' }

  get isTAG () {
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

  get isEmail () {
    const reservedWords = [
      'email',
      'e-mail',
      'mail'
    ]
    return !!reservedWords.find((word) => word === this.name)
  }

  get isPassword () {
    const reservedWords = [
      'password',
      'senha'
    ]
    return !!reservedWords.find((word) => word === this.name)
  }

  get isUrl () {
    const reservedWords = [
      'url',
      'link'
    ]
    return !!reservedWords.find((word) => word === this.name)
  }

  get isImageUrl () {
    const reservedWords = [
      'imageUrl',
      'photoUrl',
      'avatar',
      'fotoUrl',
      'urlImagem'
    ]
    return !!reservedWords.find((word) => word === this.name)
  }

  get isPhone () {
    const reservedWords = [
      'phone',
      'cellphone',
      'cellPhone',
      'mobile',
      'telephone',
      'phoneNumber',
      'telefone',
      'celular'
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

  // Type Origin
  get isPrimaryOrigin () { return this.typeOrigin === 'primary' }
  get isArrayOrigin () { return this.typeOrigin === 'array' }
  get isObjectOrigin () { return this.typeOrigin === 'object' }

  get typeOrigin () {
    if (!this.isArray && !this.isObject) {
      return 'primary'
    } else if (this.isArray && !this.isObject) {
      return 'array'
    } else if (!this.isArray && this.isObject) {
      return 'object'
    }
    return 'error'
  }

  get responses () {
    const result = []
    if (this.isObjectOrigin || this.isArrayOrigin) {
      result.push({
        title: 'ResponseSerialize',
        attr: `${this.type}`
      })
    }
    if (this.isPassword) {
      result.push({
        title: 'ResponseHidden',
        attr: ``
      })
    }
    return result
  }

  get validations () {
    const result = []

    if (this.isRequired) {
      result.push({
        title: 'ValidationRequired',
        attr: ``
      })
    }

    if (this.isEmail || this.isTAG) {
      result.push({
        title: 'ValidationMaxLength',
        attr: `31`
      })
    } else if (this.isString) {
      result.push({
        title: 'ValidationMaxLength',
        attr: `255`
      })
    }

    if (this.isEmail) {
      result.push({
        title: 'ValidationEmail',
        attr: ``
      })
    }

    if (this.isPassword) {
      result.push({
        title: 'ValidationPasswordLength',
        attr: `6, 31`
      })
    }

    return result
  }

  /**
   * Print this attribute into the template generator
   */
  build () {
    let result = ''

    this.responses.forEach((resp) => {
      result += `  @${resp.title}(${resp.attr})\n`
    })
    this.validations.forEach((valid) => {
      result += `  @${valid.title}(${valid.attr})\n`
    })

    if (!this.foreign || !this.foreignType) {
      result += `  ${this.name + this.requiredBuild}: ${this.typeBuild} = ${this.valueBuild}\n`
    } else {
      result += `  get ${this.name}() {\n`
      result += `    if (!this.${this.foreign}) return 0\n`
      result += `    return this.${this.foreign}.$id || 0\n`
      result += `  }\n`
      result += `  set ${this.name}(${this.name}: ID) {\n`
      result += `    if (!this.${this.foreign}) this.${this.foreign} = new ${this.foreignType}()\n`
      result += `    this.${this.foreign}.$id = ${this.name}\n`
      result += `  }\n`
    }

    return result
  }

  get requiredBuild () {
    return this.isRequired ? '' : '?'
  }

  get typeBuild () {
    if (this.isID || this.isForeign) return 'ID'
    if (this.isInteger || this.isDouble) return 'number'
    if (this.isBoolean) return 'boolean'
    if (this.isObjectOrigin) return `${this.type}`
    if (this.isArrayOrigin) return `${this.type}[]`

    return 'string'
  }

  get valueBuild () {
    if (this.isID || this.isForeign) return '0'
    if (this.isInteger || this.isDouble) return '0'
    if (this.isBoolean) return 'false'
    if (this.isObjectOrigin) return `new ${this.type}()`
    if (this.isArrayOrigin) return `[]`

    return '\'\''
  }
}
