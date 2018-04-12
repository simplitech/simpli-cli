import {Lang, Currency} from '@/simpli'
import enUS from '@/locale/en-US/lang'
import ptBR from '@/locale/pt-BR/lang'

/*
 *** IMPORT HERE THE MOMENT LANGUAGES PACKS ***
 * Note: US English is already imported by default
 */
import 'moment/locale/pt-br'

/*
 *** SET HERE THE DEFAULT LANGUAGE ***
 */
export const defaultLang = process.env.VUE_APP_LANG as Lang

/*
 *** SET HERE THE DEFAULT CURRENCY ***
 */
export const defaultCurrency = process.env.VUE_APP_CURRENCY as Currency

/*
 *** REGISTER HERE THE LOCALES ***
 */
export const locale = {
  [Lang.EN_US]: enUS,
  [Lang.PT_BR]: ptBR,
}
