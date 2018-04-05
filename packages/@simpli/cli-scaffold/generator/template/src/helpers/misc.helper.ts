import {plainToClassFromExist} from 'class-transformer'
import {t} from '@/helpers/prototypes.helper'
import {getCurrency} from '@/helpers/vuex/root.helper'

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function clone(newEntity: any, fromEntity: any) {
  const json = JSON.stringify(fromEntity)
  const data = JSON.parse(json)
  return plainToClassFromExist(newEntity, data) as typeof newEntity
}

export function createCsvFile(filename: string, csvStr: string) {
  const csvData = new Blob([`\uFEFF${csvStr}`], {type: 'text/csv;charset=utf-8;'})
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(csvData, filename)
  } else {
    const link = document.createElement('a')
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(csvData)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}

export function getCurrencyConfig() {
  return {
    decimal: t('lang.decimal') as string,
    thousands: t('lang.thousands') as string,
    prefix: t(`currency.${getCurrency()}.prefix`) as string,
    precision: Number(t(`currency.${getCurrency()}.precision`) as string),
  }
}

