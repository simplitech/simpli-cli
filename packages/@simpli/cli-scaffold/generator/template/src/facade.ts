import Vue from 'vue'
import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'

import AppVue from '@/App.vue'
import {store} from '@/store'
import {Config} from '@/app/Config'
import {App} from '@/app/vuex/App'
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
import {Auth} from '@/app/vuex/Auth'
<%_ } _%>
import {FilterHelper} from '@/helpers/FilterHelper'
import {FileHelper} from '@/helpers/FileHelper'
import {XlsxHelper} from '@/helpers/XlsxHelper'
import {DialogHelper} from '@/helpers/DialogHelper'
import {NavHelper} from '@/helpers/NavHelper'
import {EnvHelper} from '@/helpers/EnvHelper'
import {ToastHelper} from '@/helpers/ToastHelper'
import {UtilsHelper} from '@/helpers/UtilsHelper'

Vue.use(VueRouter)
Vue.use(VueI18n)

export abstract class $ {
  static readonly vm = new Vue({
    router: new VueRouter(Config.router),
    i18n: new VueI18n(Config.i18n),
    store,
    render: h => h(AppVue),
  })

  // App
  static readonly app = App
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
  static readonly auth = Auth
<%_ } _%>
  static readonly config = Config

  // Helpers
  static readonly env = EnvHelper
  static readonly file = FileHelper
  static readonly xlsx = XlsxHelper
  static readonly dialog = DialogHelper
  static readonly filter = FilterHelper
  static readonly nav = NavHelper
  static readonly toast = ToastHelper
  static readonly utils = UtilsHelper

  // Alias
  static get t() {
    return this.vm.$t
  }
  static get tc() {
    return this.vm.$tc
  }
  static get te() {
    return this.vm.$te
  }
  static get d() {
    return this.vm.$d
  }
  static get n() {
    return this.vm.$n
  }

  static get router() {
    return this.vm.$router
  }

  static get route() {
    return this.vm.$route
  }

  static get await() {
    return this.vm.$await
  }

  static get modal() {
    return this.vm.$modal
  }

  static get snotify() {
    return this.vm.$snotify
  }

  static get axios() {
    return this.config.http.axiosInstance
  }

  static get socket() {
    return this.config.http.socketInstance
  }
}
