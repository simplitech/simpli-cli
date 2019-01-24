/**
 * @file
 * App bootstrap
 *
 * This file contains the set responsible for app initialization
 */

import Simpli from 'simpli-web-sdk'

import {apiURL, socketURL, httpInterceptor} from '@/config/http.config'
import {defaultCurrency, defaultLang, locale} from '@/config/locale.config'
import {components} from '@/config/component.config'
import {filters} from '@/config/filter.config'
import {router} from '@/config/router.config'

Simpli.apiURL = apiURL
Simpli.socketURL = socketURL
Simpli.httpInterceptor = httpInterceptor
Simpli.lang = defaultLang
Simpli.currency = defaultCurrency
Simpli.components = components
Simpli.filters = filters
Simpli.locale = locale
Simpli.router = router

Simpli.init()
