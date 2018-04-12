import Vue from 'vue'
import SimpliPack from 'simpli-ts-vue'

import {apiURL, httpInterceptor} from '@/config/http.config'
import {defaultCurrency, defaultLang, locale} from '@/config/locale.config'
import {component} from '@/config/component.config'
import {filter} from '@/config/filter.config'
import {router} from '@/config/router.config'

Vue.use(SimpliPack, {
  apiURL,
  httpInterceptor,
  defaultLang,
  defaultCurrency,
  component,
  filter,
  locale,
  router,
})
