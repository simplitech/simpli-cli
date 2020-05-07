/**
 * @file
 * Locale Configuration
 * Used in library: vue-i18n
 *
 * This file controls the languages and currencies
 * See https://kazupon.github.io/vue-i18n/guide/started.html
 * This configuration will be set in @/app/Setup.ts
 */

import {I18nOptions} from 'vue-i18n'

import {Lang} from '@/enums/Lang'
import {Currency} from '@/enums/Currency'
<%_ var availableLanguages = rootOptions.scaffoldSetup.availableLanguages _%>
<%_ var camelCase = rootOptions.scaffoldSetup.camelCase _%>
<%_ var kebabCase = rootOptions.scaffoldSetup.kebabCase _%>
<%_ var snakeUpperCase = rootOptions.scaffoldSetup.snakeUpperCase _%>

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
 * VUE I18n Configuration
 */
export class I18nConfig implements I18nOptions {
  readonly locale = process.env.VUE_APP_LANG! as Lang
  readonly currency = process.env.VUE_APP_CURRENCY! as Currency

  readonly messages = {
<%_ for (var i in availableLanguages) { var langs = availableLanguages[i] _%>
    [Lang.<%-snakeUpperCase(langs)%>]: require('../locale/<%-langs%>/lang.json'),
<%_ } _%>
  }

  readonly messagesVeeValidate = {
    [Lang.EN_US]: require('vee-validate/dist/locale/en'),
    [Lang.PT_BR]: require('vee-validate/dist/locale/pt_BR'),
  }
}
