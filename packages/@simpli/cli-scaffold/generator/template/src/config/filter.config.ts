import {FilterObject} from '@/types/plugin'

/*
 *** REGISTER HERE YOUR FILTERS ***
 * Note: you can access globally by using vm.$filter or helper
 */
export const Filter: FilterObject = {
  truncate: (value?: string, length?: number): string => {
    if (!value) return ''
    if (value.length > (length || 0)) {
      return `${value.substring(0, length)}...`
    }
    return value
  },

  removeDelimiters: (value?: string): string => {
    if (!value) return ''
    return value.replace(/[. ,:\-/]+/g, '')
  },

  rg: (value?: string): string => {
    if (!value) return ''
    let v = value.replace(/\D/g, '')
    v = v.replace(/(\d{2})(\d{3})(\d{3})(\d{1})$/, '$1.$2.$3-$4')
    return v
  },

  cpf: (value?: string): string => {
    if (!value) return ''
    let v = value.replace(/\D/g, '')
    v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
    return v
  },

  cnpj: (value?: string): string => {
    if (!value) return ''
    let v = value.replace(/\D/g, '')
    v = v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
    return v
  },

  phone: (value?: string): string => {
    if (!value) return ''
    let v = value.replace(/\D/g, '')
    v = v.replace(/(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
    return v
  },

  cep: (value?: string): string => {
    if (!value) return ''
    let v = value.replace(/\D/g, '')
    v = v.replace(/(\d{5})(\d{3})$/, '$1-$2')
    return v
  },
}
