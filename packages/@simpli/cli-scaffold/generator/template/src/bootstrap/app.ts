/**
 * @file
 * App bootstrap
 *
 * This file contains the set responsible for app initialization
 */

import Simpli from 'simpli-web-sdk'

import {apiURL, httpInterceptor} from '@/config/http.config'
import {defaultCurrency as currency, defaultLang as lang, locale} from '@/config/locale.config'
import {components} from '@/config/component.config'
import {filters} from '@/config/filter.config'
import {router} from '@/config/router.config'

Simpli.apiURL = apiURL
Simpli.httpInterceptor = httpInterceptor
Simpli.lang = lang
Simpli.currency = currency
Simpli.components = components
Simpli.filters = filters
Simpli.locale = locale
Simpli.router = router

Simpli.init()
