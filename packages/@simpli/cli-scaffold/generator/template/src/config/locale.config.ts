import {Lang, Currency} from '@/simpli'
<%_ var availableLanguages = rootOptions.scaffoldSetup.availableLanguages _%>
<%_ var camelCase = rootOptions.scaffoldSetup.camelCase _%>
<%_ var kebabCase = rootOptions.scaffoldSetup.kebabCase _%>
<%_ var snakeUpperCase = rootOptions.scaffoldSetup.snakeUpperCase _%>

<%_ for (var i in availableLanguages) { var langs = availableLanguages[i] _%>
import <%-camelCase(langs)%> from '@/locale/<%-langs%>/lang'
<%_ } _%>

/*
 *** IMPORT HERE THE MOMENT LANGUAGES PACKS ***
 * Note: US English is already imported by default
 */
<%_ for (var i in availableLanguages) { var langs = availableLanguages[i] _%>
<%_ if (langs !== 'en-us') { _%>
import 'moment/locale/<%-kebabCase(langs)%>'
<%_ } _%>
<%_ } _%>

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
<%_ for (var i in availableLanguages) { var langs = availableLanguages[i] _%>
  [Lang.<%-snakeUpperCase(langs)%>]: <%-camelCase(langs)%>,
<%_ } _%>
}
