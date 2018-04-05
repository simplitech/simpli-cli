import Vue from 'vue'
import './registerServiceWorker'
import App from './App.vue'
import {getCurrencyConfig} from '@/helpers/misc.helper'

import 'reflect-metadata' // Serialization
import 'font-awesome/css/font-awesome.min.css' // Icons
import 'vue-multiselect/dist/vue-multiselect.min.css' // Vue multiselect
import 'chart.js' // Chart

// Vendor Plugins
import VueMeta from 'vue-meta'
import VueSnotify from 'vue-snotify'
import VueMask from 'v-mask'
import VueMoney from 'v-money'
import VueMoment from 'vue-moment'
import VueChartkick from 'vue-chartkick'
const Chartkick = require('chartkick')

// Native Plugins
import {store} from '@/store'
import AppPlugin, {router, i18n} from '@/app/Plugin'

Vue.use(VueMeta)
Vue.use(VueSnotify)
Vue.use(VueMask)
Vue.use(VueMoney, getCurrencyConfig())
Vue.use(VueMoment)
Vue.use(VueChartkick, {Chartkick})

Vue.use(AppPlugin)

Vue.config.productionTip = false

new Vue({
  router,
  i18n,
  store,
  render: (h) => h(App),
}).$mount('#app')
