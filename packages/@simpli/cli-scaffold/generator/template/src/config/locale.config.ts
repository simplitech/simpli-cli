/**
 * @file
 * Locale Configuration
 * Used in library: vue-i18n
 *
 * This file controls the languages and currencies
 * See https://kazupon.github.io/vue-i18n/guide/started.html
 * This configuration will be set in @/bootstrap/app.ts
 */

import {Lang, Currency, LocaleOptions} from '@/simpli'
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
 */
export const defaultLang = process.env.VUE_APP_LANG as Lang

/**
 * App default currency
 */
export const defaultCurrency = process.env.VUE_APP_CURRENCY as Currency

/**
 * vue-i18n locale
 */
export const localeVueI18n: LocaleOptions = {
<%_ for (var i in availableLanguages) { var langs = availableLanguages[i] _%>
  [Lang.<%-snakeUpperCase(langs)%>]: <%-camelCase(langs)%>,
<%_ } _%>
}

/**
 * ajv-i18n locale
 */
export const localeAjvI18n: LocaleOptions = {
  [Lang.EN_US]: require('ajv-i18n/localize/en'),
  [Lang.AR]: require('ajv-i18n/localize/ar'),
  [Lang.DE]: require('ajv-i18n/localize/de'),
  [Lang.ES]: require('ajv-i18n/localize/es'),
  [Lang.FR]: require('ajv-i18n/localize/fr'),
  [Lang.HU]: require('ajv-i18n/localize/hu'),
  [Lang.IT]: require('ajv-i18n/localize/it'),
  [Lang.JA]: require('ajv-i18n/localize/ja'),
  [Lang.NB]: require('ajv-i18n/localize/nb'),
  [Lang.NL]: require('ajv-i18n/localize/nl'),
  [Lang.PL]: require('ajv-i18n/localize/pl'),
  [Lang.PT_BR]: require('ajv-i18n/localize/pt-BR'),
  [Lang.RU]: require('ajv-i18n/localize/ru'),
  [Lang.SK]: require('ajv-i18n/localize/sk'),
  [Lang.SV]: require('ajv-i18n/localize/sv'),
  [Lang.TH]: require('ajv-i18n/localize/th'),
  [Lang.ZH_CN]: require('ajv-i18n/localize/zh'),
  [Lang.ZH_TW]: require('ajv-i18n/localize/zh-TW'),
}
