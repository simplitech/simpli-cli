/**
 * @file
 * Locale Configuration
 * Used in library: vue-i18n
 *
 * This file controls the languages and currencies
 * See https://kazupon.github.io/vue-i18n/guide/started.html
 * This configuration will be set in @/bootstrap/app.ts
 */

import {Lang, Currency} from '@/simpli'
<%_ var availableLanguages = rootOptions.scaffoldSetup.availableLanguages _%>
<%_ var camelCase = rootOptions.scaffoldSetup.camelCase _%>
<%_ var kebabCase = rootOptions.scaffoldSetup.kebabCase _%>
<%_ var snakeUpperCase = rootOptions.scaffoldSetup.snakeUpperCase _%>

/**
 * App languages pack
 */
<%_ for (var i in availableLanguages) { var langs = availableLanguages[i] _%>
import <%-camelCase(langs)%> from '@/locale/<%-langs%>/lang'
<%_ } _%>

/**
 * Moment JS languages pack
 * Note: US English is already imported by default
 */
<%_ for (var i in availableLanguages) { var langs = availableLanguages[i] _%>
<%_ if (langs !== 'en-US') { _%>
import 'moment/locale/<%-kebabCase(langs)%>'
<%_ } _%>
<%_ } _%>

/**
 * App default language
 * @type {Lang}
 */
export const defaultLang = process.env.VUE_APP_LANG as Lang

/**
 * App default currency
 * @type {Currency}
 */
export const defaultCurrency = process.env.VUE_APP_CURRENCY as Currency

/**
 * VUE i18n locale
 */
export const locale = {
<%_ for (var i in availableLanguages) { var langs = availableLanguages[i] _%>
  [Lang.<%-snakeUpperCase(langs)%>]: <%-camelCase(langs)%>,
<%_ } _%>
}
