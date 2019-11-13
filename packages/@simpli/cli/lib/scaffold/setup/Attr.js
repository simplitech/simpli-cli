const enUs = require('../../lang/en-us.json')
const ptBr = require('../../lang/pt-br.json')
const camelCase = require('lodash.camelcase')
const mergeWith = require('lodash.mergewith')
const uniq = require('lodash.uniq')
const stringToParagraph = require('../../util/stringToParagraph')

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

module.exports = class Attr {
  constructor (name, belongsTo, prop) {
    this.name = name || ''
    this.description = prop.description || null
    this.belongsTo = belongsTo
    this.default = prop.default !== undefined ? prop.default : null
    this.type = prop.type
    this.maxLength = prop.maxLength || null
    this.foreign = null
    this.foreignType = null
    this.foreignIsRequired = null
    this.fromResp = false
    this.isArray = false
    this.isArrayPrimitive = null
    this.isObject = false
    this.isRequired = false

    // The object model is a resource (only if isObject = true)
    this.isObjectResource = false

    this.setType(prop)
  }

  setType (entry) {
    if (this.isEmail && !entry.$ref) {
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
      if (entry.items) {
        if (entry.items.$ref) {
          this.type = entry.items.$ref.match(/[^\/]+(?=\/$|$)/)[0]
          this.isArrayPrimitive = false
        } else {
          this.type = entry.items.type
          this.isArrayPrimitive = true
        }
      }
    } else if (entry.type === 'object' || entry.$ref) {
      this.isArray = false
      this.isObject = true
      this.type = entry.$ref && entry.$ref.match(/[^\/]+(?=\/$|$)/)[0]
    }
  }

  // Type Primary
  get isID () {
    const name = this.name || ''
    const idMatch = name.match(/^(id)\w+(Pk)$/)
    const idEquals = name.toLowerCase() === 'id'

    return this.isPrimaryOrigin && (idMatch || idEquals)
  }
  get isForeign () {
    const name = this.name || ''
    const idMatch = name.match(/^(id)\w+(Fk)$/)

    return this.isPrimaryOrigin && idMatch
  }
  get isModel () {
    return this.isObjectOrigin || (this.isArrayOrigin && !this.isArrayPrimitive)
  }
  get isString () { return this.isPrimaryOrigin && this.type === 'string' }
  get isInteger () { return this.isPrimaryOrigin && this.type === 'integer' }
  get isDouble () { return this.isPrimaryOrigin && this.type === 'double' }
  get isBoolean () { return this.isPrimaryOrigin && this.type === 'boolean' }
  get isDate () { return this.isPrimaryOrigin && this.type === 'date' }
  get isDatetime () { return this.isPrimaryOrigin && this.type === 'datetime' }

  get isTextarea () {
    // TODO: add textarea type
    return false
  }

  is (entity) {
    if (reservedWords[entity]) {
      return !!reservedWords[entity].find((word) => word === this.name)
    }
    return false
  }

  get isTAG () { return this.is('tag') }

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

  get isMultiline () {
    return Boolean(this.description || this.responses.length)
  }

  get responses () {
    const result = []

    // Decorator in type 'ID' is not allowed
    if (this.isID || this.isForeign) return result

    if (this.isModel) {
      result.push({
        title: 'ResponseSerialize',
        attr: `${this.type}`
      })
    }
    if (this.isPassword) {
      result.push({
        title: 'ResponseExclude',
        attr: ``
      })
    }
    return result
  }

  /**
   * @deprecated
   */
  get validations () {
    const result = []

    // Decorator in type 'ID' is not allowed
    if (this.isID || this.isForeign) return result

    if (this.isRequired) {
      result.push({
        title: 'ValidationRequired',
        attr: ``
      })
    }

    if (this.isEmail || this.isTAG) {
      result.push({
        title: 'ValidationMaxLength',
        attr: `100`
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
        attr: `6, 100`
      })
    }

    if (this.isPhone) {
      result.push({
        title: 'ValidationPhone',
        attr: ``
      })
    }

    if (this.isZipcode) {
      result.push({
        title: 'ValidationCEP',
        attr: ``
      })
    }

    if (this.isRg) {
      result.push({
        title: 'ValidationRG',
        attr: ``
      })
    }

    if (this.isCpf) {
      result.push({
        title: 'ValidationCPF',
        attr: ``
      })
    }

    if (this.isCnpj) {
      result.push({
        title: 'ValidationCNPJ',
        attr: ``
      })
    }

    return result
  }

  get typeBuild () {
    let nullType = ' | null'
    if (this.isID) nullType = ''

    if (this.isInteger || this.isDouble) return `number${nullType}`
    if (this.isBoolean) return `boolean${nullType}`
    if (this.isObjectOrigin) return `${this.type}${nullType}`
    if (this.isArrayOrigin) return `${this.type}[]${nullType}`

    return `string${nullType}`
  }

  get valueBuild () {
    if (this.isID) {
      if (this.isString) return '\'\''
      return '0'
    }
    return 'null'
  }

  buildCommentary () {
    let result = ''
    const description = stringToParagraph(this.description, 15, '   * ')

    if (description) {
      result += `  /**\n`
      result += `   * ${description}\n`
      result += `   */\n`
    }

    return result
  }

  /**
   * Print this attribute into the template generator
   */
  build () {
    let result = this.buildCommentary()

    this.responses.forEach((resp) => {
      result += `  @${resp.title}(${resp.attr})\n`
    })

    result += `  ${this.name}: ${this.typeBuild} = ${this.valueBuild}\n`

    if (this.isMultiline) {
      result += '\n'
    }

    return result
  }

  /**
   * Print this attribute foreign into the template generator
   */
  buildForeign () {
    let result = this.buildCommentary()

    this.responses.forEach((resp) => {
      result += `  @${resp.title}(${resp.attr})\n`
    })

    result += `  get ${this.name}() {\n`
    if (!this.foreignIsRequired) {
      result += `    if (!this.${this.foreign}) return 0\n`
    }
    result += `    return this.${this.foreign}.$id\n`
    result += `  }\n`
    result += `  set ${this.name}(val) {\n`
    if (!this.foreignIsRequired) {
      result += `    if (!this.${this.foreign}) this.${this.foreign} = new ${this.foreignType}()\n`
    }
    result += `    this.${this.foreign}.$id = val\n`
    result += `  }\n\n`

    return result
  }

  /**
   * Print this attribute into the template generator
   * @param origin Name of class (e.g. User)
   * @param originAttr Name of property (e.g. user)
   * @deprecated
   */
  buildPersist (origin, originAttr) {
    let result = ''
    if (!origin || !originAttr) return result

    if (this.isObjectOrigin || this.isArrayOrigin) {
      result += `        <multiselect-group\n`
      if (this.isRequired) {
        result += `          required\n`
      }
      result += `          v-model="model.${originAttr}.${this.name}"\n`
      result += `          :items="model.all${this.type}"\n`
      result += `        >\n`
      result += `          {{ $t("classes.${origin}.columns.${this.name}") }}\n`
      result += `        </multiselect-group>\n`
    } else if (this.isBoolean) {
      result += `        <checkbox-group\n`
      result += `          v-model="model.${originAttr}.${this.name}"\n`
      result += `        >\n`
      result += `          {{ $t("classes.${origin}.columns.${this.name}") }}\n`
      result += `        </checkbox-group>\n`
    } else if (this.isTextarea) {
      result += `        <textarea-group\n`
      result += `          row="3"\n`
      result += `          v-model="model.${originAttr}.${this.name}"\n`
      result += `        >\n`
      result += `          {{ $t("classes.${origin}.columns.${this.name}") }}\n`
      result += `        </textarea-group>\n`
    } else if (!this.isID && !this.isForeign) {
      result += `        <input-group\n`
      if (this.isRequired && !this.isPassword) {
        result += `          required\n`
      }
      if (this.isInteger || this.isDouble) {
        result += `          type="number"\n`
        if (this.isInteger) {
          result += `          step="1"\n`
        }
        if (this.isDouble) {
          result += `          step="any"\n`
        }
        result += `          :placeholder="$t('persist.number')"\n`
      } else if (this.isDate) {
        result += `          type="date"\n`
        result += `          :placeholder="$t('dateFormat.date')"\n`
      } else if (this.isDatetime) {
        result += `          type="datetime"\n`
        result += `          :placeholder="$t('dateFormat.datetime')"\n`
      } else if (this.isEmail) {
        result += `          type="email"\n`
        result += `          maxLength="100"\n`
      } else if (this.isPassword) {
        result += `          type="password"\n`
        result += `          maxLength="100"\n`
        result += `          :placeholder="model.${originAttr}.$id ? $t('app.onlyIfWantChangePassword') : ''"\n`
      } else if (this.isMoney) {
        result += `          type="money"\n`
      } else if (this.isPhone) {
        result += `          type="phone"\n`
      } else if (this.isZipcode) {
        result += `          type="cep"\n`
      } else if (this.isCpf) {
        result += `          type="cpf"\n`
      } else if (this.isCnpj) {
        result += `          type="cnpj"\n`
      } else if (this.isRg) {
        result += `          type="rg"\n`
      } else {
        result += `          type="text"\n`
        result += `          maxLength="255"\n`
      }
      result += `          v-model="model.${originAttr}.${this.name}"\n`
      result += `        >\n`
      result += `          {{ $t("classes.${origin}.columns.${this.name}") }}\n`
      result += `        </input-group>\n`
    }

    return result
  }
}
