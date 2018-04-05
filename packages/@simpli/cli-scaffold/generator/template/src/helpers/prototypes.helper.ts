import Vue from 'vue'
import VueSnotify from 'vue-snotify'

import AppPlugin, {router as _router, i18n as _i18n} from '@/app/Plugin'

Vue.use(VueSnotify)
Vue.use(AppPlugin)

export const bus = new Vue({router: _router, i18n: _i18n})

// Prototypes
export const filter = bus.$filter
export const resource = bus.$resource
export const http = bus.$http
export const uri = bus.$uri
export const locale = bus.$locale
export const route = bus.$route
export const router = bus.$router
export const snotify = bus.$snotify
export const t = bus.$t
export const tc = bus.$tc
export const te = bus.$te
export const d = bus.$d
export const n = bus.$n
export const i18n = _i18n
