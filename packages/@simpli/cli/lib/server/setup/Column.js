const enUs = require('../../lang/en-us.json')
const ptBr = require('../../lang/pt-br.json')
const camelCase = require('lodash.camelcase')
const mergeWith = require('lodash.mergewith')
const uniq = require('lodash.uniq')

const reservedWords = mergeWith(
  {},
  ptBr.reservedWords,
  enUs.reservedWords,
  (obj, src) => {
    if (obj && Array.isArray(obj)) {
      // Merge all reserved words, remove duplications then transform into camelCase
      return uniq(obj.concat(src).map((item) => camelCase(item))) || []
    }
  }
)

module.exports = class Column {
  constructor (dataColumn = {}) {
    this.field = dataColumn.Field || null
    this.commentary = dataColumn.Commentary || null
    this.type = dataColumn.Type || null
    this.keyType = dataColumn.Key || null
    this.nullable = dataColumn.Null || null
    this.default = dataColumn.Default || null
    this.extra = dataColumn.Extra || null
    this.foreign = null // Relation class
  }

  get name () {
    return camelCase(this.field)
  }

  get capitalizedName () {
    const capitalizeFirstLetter = (str = '') => {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
    return capitalizeFirstLetter(this.name)
  }

  get kotlinType () {
    const type = this.type || ''
    if ((type.match(/^VARCHAR|TEXT(?:\(\d+\))*$/gi))) return 'String'
    if ((type.match(/^INT|BIGINT(?:\(\d+\))*$/gi))) return 'Long'
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
    if (this.isID) {
      if (this.isString) return '\"\"'
      return '0'
    }
    if (this.isLong) return '0'
    if (this.isDouble) return '0.0'
    if (this.isBoolean) return 'false'
    return 'null'
  }

  get testValue () {
    if (!this.isRequired) return 'null'
    if (this.isID) {
      if (this.isString) return '\"1\"'
      return '1'
    }
    if (this.isLong) return '1'
    if (this.isDouble) return '1.0'
    if (this.isBoolean) return 'true'
    if (this.isEmail) return '\"any@email.com\"'
    if (this.isString) return '\"1\"'
    if (this.isDate) return 'Date()'
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
    return this.keyType === 'PRI'
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

  is (entity) {
    if (reservedWords[entity]) {
      return !!reservedWords[entity].find((word) => word === this.name)
    }
    return false
  }

  get isTag () { return this.is('tag') }
  get isNickname () { return this.is('nickname') }
  get isName () { return this.is('name') }
  get isFirstName () { return this.is('firstName') }
  get isLastName () { return this.is('lastName') }
  get isFullName () { return this.is('fullName') }
  get isPassword () { return this.is('password') }
  get isEmail () { return this.is('email') }
  get isUrl () { return this.is('url') }
  get isImageUrl () { return this.is('imageUrl') }
  get isMoney () { return this.is('money') }
  get isPhone () { return this.is('phone') }
  get isStreet () { return this.is('street') }
  get isZipcode () { return this.is('zipcode') }
  get isNeighborhood () { return this.is('neighborhood') }
  get isCity () { return this.is('city') }
  get isState () { return this.is('state') }
  get isCountry () { return this.is('country') }
  get isLatitude () { return this.is('latitude') }
  get isLongitude () { return this.is('longitude') }
  get isCoordinate () { return this.is('coordinate') }
  get isCpf () { return this.is('cpf') }
  get isCnpj () { return this.is('cnpj') }
  get isRg () { return this.is('rg') }
  get isUpdatedAt () { return this.is('updatedAt') }
  get isCreatedAt () { return this.is('createdAt') }
  get isDeletedAt () { return this.is('deletedAt') }
  get isSoftDelete () { return this.is('softDelete') }
}
