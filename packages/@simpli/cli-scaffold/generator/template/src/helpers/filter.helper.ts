import {filter, t} from '@/helpers/prototypes.helper'
import moment, {Moment} from 'moment'

export const bool = (val?: boolean) => val !== undefined ? t(`boolean.${val}`) as string : ''

export const datetime = (date?: string | Date | Moment): string =>
  date ? moment(date).format(t('dateFormat.datetime') as string) : ''

export const date = (date?: string | Date | Moment): string =>
  date ? moment(date).format(t('dateFormat.date') as string) : ''

export const time = (date?: string | Date | Moment): string =>
  date ? moment(date).format(t('dateFormat.time') as string) : ''

export const phone = (val?: string): string => !!val ? filter.phone(val) : ''

export const cep = (val?: string): string => !!val ? filter.cep(val) : ''

export const cpf = (val?: string): string => !!val ? filter.cpf(val) : ''

export const cnpj = (val?: string): string => !!val ? filter.cnpj(val) : ''

