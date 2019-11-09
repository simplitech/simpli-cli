/**
 * @file
 * App bootstrap
 *
 * This file contains the set responsible for app initialization
 */

import Simpli from 'simpli-web-sdk'

import {axiosInstance, socketInstance} from '@/config/http.config'
import {defaultCurrency, defaultLang, localeVueI18n, localeVeeValidate} from '@/config/locale.config'
import {components} from '@/config/component.config'
import {filters} from '@/config/filter.config'
import {router} from '@/config/router.config'

Simpli.axios = axiosInstance
Simpli.socket = socketInstance
Simpli.lang = defaultLang
Simpli.currency = defaultCurrency
Simpli.components = components
Simpli.filters = filters
Simpli.locale = localeVueI18n
Simpli.localeVeeValidate = localeVeeValidate
Simpli.router = router

Simpli.install()
