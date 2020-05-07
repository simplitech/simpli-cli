import moment from 'moment'
import {$} from '@/facade'
import {InputType} from '@simpli/vue-input/lib/InputType'

export abstract class FilterHelper {
  static toString(input?: InputType) {
    return input !== null && input !== undefined ? String(input) : ''
  }

  static bool(input?: InputType | boolean) {
    return input !== undefined && input !== null
      ? ($.t(`boolean.${Boolean(input)}`) as string)
      : ''
  }

  static datetime(input?: moment.MomentInput | null) {
    return moment(input ?? undefined).isValid()
      ? moment(input ?? undefined).format($.t('dateFormat.datetime') as string)
      : ''
  }

  static date(input?: moment.MomentInput | null) {
    return moment(input ?? undefined).isValid()
      ? moment(input ?? undefined).format($.t('dateFormat.date') as string)
      : ''
  }

  static time(input?: moment.MomentInput | null) {
    return moment(input ?? undefined).isValid()
      ? moment(input ?? undefined).format($.t('dateFormat.time') as string)
      : ''
  }

  static truncate(input?: InputType, length?: number) {
    const value = this.toString(input)
    if (value.length > (length || 0)) {
      return `${value.substring(0, length)}...`
    }
    return value
  }

  static stripHtml(input?: InputType) {
    const value = this.toString(input)
    const doc = new DOMParser().parseFromString(value, 'text/html')
    return doc.body.textContent || ''
  }

  static removeDelimiters(input?: InputType) {
    return this.toString(input).replace(/[. ,:\-/]+/g, '')
  }

  static phone(input?: InputType) {
    return this.toString(input)
      .replace(/\D/g, '')
      .replace(
        new RegExp($.t('filter.phone.regex') as string),
        $.t('filter.phone.format') as string
      )
  }

  static zipcode(input?: InputType) {
    return this.toString(input)
      .replace(/\D/g, '')
      .replace(
        new RegExp($.t('filter.zipcode.regex') as string),
        $.t('filter.zipcode.format') as string
      )
  }

  static rg(input?: InputType) {
    return this.toString(input)
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d{3})(\d{3})(\d{1})$/, '$1.$2.$3-$4')
  }

  static cpf(input?: InputType) {
    return this.toString(input)
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
  }

  static cnpj(input?: InputType) {
    return this.toString(input)
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
  }

  static cpfOrCnpj(input?: InputType) {
    const value = this.toString(input).replace(/\D/g, '')

    if (value.length === 11) {
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
    }

    if (value.length === 14) {
      return value.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        '$1.$2.$3/$4-$5'
      )
    }

    return value
  }

  static pad(input?: InputType, length = 2) {
    let value = this.toString(input)
    while (value.length < length) value = `0${value}`
    return value
  }
}
