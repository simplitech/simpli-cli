import {LocaleObject} from '@/types/plugin'
import enUS from '@/locale/en-US/lang'
import ptBR from '@/locale/pt-BR/lang'

/*
 *** IMPORT HERE MOMENT LANGUAGES PACKS ***
 * Note: US English is already imported by default
 */
import 'moment/locale/pt-br'

/*
 *** REGISTER HERE YOUR AVAILABLE LANGUAGES ***
 */
export enum Lang {
  EN_US = 'en-US',
  PT_BR = 'pt-BR',
}

/*
 *** REGISTER HERE YOUR AVAILABLE CURRENCIES ***
 */
export enum CURRENCY {
  USD = 'USD',
  BRL = 'BRL',
}

/*
 *** SET HERE YOUR DEFAULT LANGUAGE ***
 */
export const DefaultLang: Lang = process.env.VUE_APP_LANG as Lang || Lang.EN_US

/*
 *** SET HERE YOUR DEFAULT CURRENCY ***
 */
export const DefaultCurrency: CURRENCY = process.env.VUE_APP_CURRENCY as CURRENCY || CURRENCY.USD

/*
 *** REGISTER HERE YOUR LOCALES ***
 * Note1: you can access your current lang globally by using vm.$locale or helper
 * Note2: there are also vm.$t, vm.$tc, vm.$te, vm.$d, vm.$n available
 * Note3: vm.$locale can provide objects and it can cause NullPointerException, so be careful
 * Note4: the variables from Note 2 are safer to use, but can't provide objects; only string
 */
export const Locale: LocaleObject = {
  [Lang.EN_US]: enUS,
  [Lang.PT_BR]: ptBR,
}
