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
    this.field = dataColumn.Field || null // column field name (e.g. myColumn)
    this.commentary = dataColumn.Commentary || null // column commentary
    this.type = dataColumn.Type || null // column type from SQL (e.g VARCHAR)
    this.keyType = dataColumn.Key || null // column key type from SQL (e.g. PRI)
    this.nullable = dataColumn.Null || null // defined if column can be null
    this.default = dataColumn.Default || null // default column value
    this.extra = dataColumn.Extra || null // extra information from SQL (e.g. auto_increment)
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
    if (this.isID) return ''
    return '?'
  }

  get defaultValue () {
    if (this.isID) {
      if (this.isString) return '\"\"'
      return '0'
    }
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

  get hasMaxlength () {
    return Boolean(this.size && (this.isString || this.isLong))
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

  get isMultiline () {
    return Boolean(this.commentary || (this.isRequired && this.hasMaxlength))
  }

  get hasSchemaParams () {
    return !!this.schemaParams.length
  }

  get schemaParams () {
    const params = []
    if (this.isRequired) {
      params.push('required = true')
    }
    if (this.hasMaxlength) {
      params.push(`maxLength = ${this.size}`)
    }
    if (this.commentary) {
      params.push(`description = "${this.commentary.replace(/(\r\n|\n|\r)/gm, '')}"`)
    }
    return params
  }

  buildSchema (indent = 1, forceNewLine = false) {
    let indentSpace = ''
    for (let i = 0; i < indent; i++) indentSpace += '    '

    const newLine = this.isMultiline ? `\n` : ''

    if (this.hasSchemaParams) {
      return `${indentSpace}@Schema(${this.schemaParams.join(', ')})${forceNewLine ? '\n' : newLine}`
    }

    return ''
  }

  build () {
    let result = this.buildSchema()

    if (result && !this.isMultiline) {
      result += ' '
    } else {
      result += '    '
    }

    result += `var ${this.name}: ${this.kotlinType}${this.qMark} = ${this.defaultValue}\n`

    if (this.isMultiline) {
      result += '\n'
    }

    return result
  }

  buildFilter () {
    if (this.isPrimary) {
      return ''
    }

    if (this.isForeign) {
      return `    var ${this.name}: List<${this.kotlinType}>?\n\n`
    }

    if (this.isLong || this.isDouble) {
      let result = ''
      result += `    var min${this.capitalizedName}: ${this.kotlinType}?\n`
      result += `    var max${this.capitalizedName}: ${this.kotlinType}?\n\n`
      return result
    }

    if (this.isDate) {
      let result = ''
      result += `    var start${this.capitalizedName}: ${this.kotlinType}?\n`
      result += `    var end${this.capitalizedName}: ${this.kotlinType}?\n\n`
      return result
    }

    return `    var ${this.name}: ${this.kotlinType}?\n\n`
  }

  buildParam () {
    let result = ''

    if (this.isPrimary) {
      return result
    }

    result += `    @QueryParam("${this.name}")\n`
    result += `    @Schema\n`

    if (this.isForeign) {
      result += `    override var ${this.name}: List<${this.kotlinType}>? = null\n\n`
      return result
    }

    if (this.isLong || this.isDouble) {
      let result = ''

      result += `    @QueryParam("min${this.capitalizedName}")\n`
      result += `    @Schema\n`
      result += `    override var min${this.capitalizedName}: ${this.kotlinType}? = null\n\n`

      result += `    @QueryParam("max${this.capitalizedName}")\n`
      result += `    @Schema\n`
      result += `    override var max${this.capitalizedName}: ${this.kotlinType}? = null\n\n`

      return result
    }

    if (this.isDate) {
      let result = ''

      result += `    @QueryParam("start${this.capitalizedName}")\n`
      result += `    @Schema\n`
      result += `    override var start${this.capitalizedName}: ${this.kotlinType}? = null\n\n`

      result += `    @QueryParam("end${this.capitalizedName}")\n`
      result += `    @Schema\n`
      result += `    override var end${this.capitalizedName}: ${this.kotlinType}? = null\n\n`

      return result
    }

    result += `    override var ${this.name}: ${this.kotlinType}? = null\n\n`
    return result
  }

  buildForeign () {
    let result = ''
    if (this.isRequired) {
      result = `    var ${this.name}: ${this.kotlinType}\n`
    } else {
      result = `    var ${this.name}: ${this.kotlinType}?\n`
    }
    result += this.buildSchema(2, true)
    if (this.isRequired) {
      result += `        get() = ${this.foreign.name}?.${this.foreign.referencedColumnName} ?: ${this.isString ? '\"\"' : '0'}\n`
    } else {
      result += `        get() = ${this.foreign.name}?.${this.foreign.referencedColumnName}\n`
    }
    result += `        set(value) {\n`
    if (this.isRequired) {
      result += `            if (value == 0L) {\n`
      result += `                ${this.foreign.name} = null\n`
      result += `                return\n`
      result += `            }\n`
    } else {
      result += `            if (value == null || value == 0L) {\n`
      result += `                ${this.foreign.name} = null\n`
      result += `                return\n`
      result += `            }\n`
    }
    result += `            if (${this.foreign.name} == null) {\n`
    result += `                ${this.foreign.name} = ${this.foreign.referencedTableModelName}()\n`
    result += `            }\n`
    result += `            ${this.foreign.name}?.${this.foreign.referencedColumnName} = value\n`
    result += `        }\n\n`

    return result
  }

  buildFilterDao () {
    if (this.isPrimary) {
      return ''
    }

    if (this.isForeign) {
      let result = ''

      result += `        filter.${this.name}?.also {\n`
      result += `            if (it.isNotEmpty()) {\n`
      result += `                whereIn("$alias.${this.name}", *it.toTypedArray())\n`
      result += `            }\n`
      result += `        }\n\n`

      return result
    }

    if (this.isLong || this.isDouble) {
      let result = ''

      result += `        filter.min${this.capitalizedName}?.also {\n`
      result += `            whereGtEq("$alias.${this.name}", it)\n`
      result += `        }\n`

      result += `        filter.max${this.capitalizedName}?.also {\n`
      result += `            whereLtEq("$alias.${this.name}", it)\n`
      result += `        }\n\n`

      return result
    }

    if (this.isDate) {
      let result = ''

      result += `        filter.start${this.capitalizedName}?.also {\n`
      result += `            whereGtEq("DATE($alias.${this.name})", Query("DATE(?)", it))\n`
      result += `        }\n`

      result += `        filter.end${this.capitalizedName}?.also {\n`
      result += `            whereLtEq("DATE($alias.${this.name})", Query("DATE(?)", it))\n`
      result += `        }\n\n`

      return result
    }

    let result = ''

    result += `        filter.${this.name}?.also {\n`
    result += `            whereEq("$alias.${this.name}", it)\n`
    result += `        }\n\n`

    return result
  }
}
