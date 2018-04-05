import Vue from 'vue'
import SimpliKit from 'simpli-ts-vue'
import {ApiURL, HttpConfigInterceptor} from '@/config/http.config'
import {DefaultCurrency, DefaultLang, Locale} from '@/config/locale.config'
import {Component} from '@/config/component.config'
import {Filter} from '@/config/filter.config'
import {Router} from '@/config/router.config'

Vue.use(SimpliKit, {
  apiURL: ApiURL,
  httpInterceptor: HttpConfigInterceptor,
  defaultLang: DefaultLang,
  defaultCurrency: DefaultCurrency,
  component: Component,
  filter: Filter,
  locale: Locale,
  router: Router,
})

import * as helper from '@/helpers/vuex/root.helper'
export * from 'simpli-ts-vue'
export const $ = Vue.helper
