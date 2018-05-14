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

module.exports = class Attr {
  constructor (name, belongsTo, prop) {
    this.name = name || ''
    this.belongsTo = belongsTo
    this.default = prop.default !== undefined ? prop.default : null
    this.type = prop.type
    this.foreign = null
    this.foreignType = null
    this.foreignIsRequired = null
    this.fromResp = false
    this.isArray = false
    this.isObject = false
    this.isRequired = false

    this.setType(prop)
  }

  setType (entry) {
    if (this.name.match(/^(id)\w+(Pk)$/) || (this.name || '').toLowerCase() === 'id') {
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
  get isID () { return this.isPrimaryOrigin && this.type === 'ID' }
  get isForeign () { return this.isPrimaryOrigin && this.type === 'foreign' }
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

  get responses () {
    const result = []

    // Decorator in type 'ID' is not allowed
    if (this.isID || this.isForeign) return result

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
    let nullType = ''
    if (!this.isRequired && !this.isTAG && !this.fromResp) nullType = ' | null'
    if (this.isID || this.isForeign) return `ID`
    if (this.isInteger || this.isDouble) return `number${nullType}`
    if (this.isBoolean) return `boolean${nullType}`
    if (this.isObjectOrigin) return `${this.type + nullType}`
    if (this.isArrayOrigin) return `${this.type}[]`

    return `string${nullType}`
  }

  get valueBuild () {
    if (
      !this.isRequired &&
      !this.fromResp &&
      !this.isID &&
      !this.isForeign &&
      !this.isTAG &&
      !this.isArrayOrigin
    ) return 'null'
    if (this.isID || this.isForeign) return '0'
    if (this.isInteger || this.isDouble) return '0'
    if (this.isBoolean) return 'false'
    if (this.isObjectOrigin) return `new ${this.type}()`
    if (this.isArrayOrigin) return `[]`

    return '\'\''
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
      result += `  ${this.name}: ${this.typeBuild} = ${this.valueBuild}\n`
    } else {
      result += `  get ${this.name}() {\n`
      if (!this.foreignIsRequired) {
        result += `    if (!this.${this.foreign}) return 0\n`
      }
      result += `    return this.${this.foreign}.$id\n`
      result += `  }\n`
      result += `  set ${this.name}(${this.name}: ID) {\n`
      if (!this.foreignIsRequired) {
        result += `    if (!this.${this.foreign}) this.${this.foreign} = new ${this.foreignType}()\n`
      }
      result += `    this.${this.foreign}.$id = ${this.name}\n`
      result += `  }\n`
    }

    return result
  }

  /**
   * Print this attribute into the template generator
   * @param origin Name of class (e.g. User)
   * @param originAttr Name of property (e.g. user)
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
