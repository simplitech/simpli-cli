import * as moment from 'moment'
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
import VueResource from 'vue-resource'
import {DefaultLang, Locale} from '@/config/locale.config'
import {Component} from '@/config/component.config'
import {Filter} from '@/config/filter.config'
import {HttpConfigInterceptor} from '@/config/http.config'
import {Router, Uri} from '@/config/router.config'

Vue.use(VueRouter)
Vue.use(VueI18n)

export const router = new VueRouter(Router)
export const i18n = new VueI18n({ locale: DefaultLang, messages: Locale })
moment.locale(i18n.locale)

export default {
  install(v: any): void {
    v.use(VueResource)

    v.http.interceptors.push(HttpConfigInterceptor)

    Object.keys(Filter).forEach((key: string) => {
      v.filter(key, Filter[key])
    })

    Object.keys(Component).forEach((key: string) => {
      v.component(key, Component[key])
    })

    v.prototype.$uri = Uri
    v.prototype.$filter = Filter
    v.prototype.$locale = Locale[DefaultLang]
  },
}
