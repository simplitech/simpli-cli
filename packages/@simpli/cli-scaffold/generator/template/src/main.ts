import Vue from 'vue'
import App from './App.vue'

import '@/setup/simpli'
import '@/setup/settings'
import '@/setup/vendor'

import {$} from 'simpli-web-sdk'
import {store} from '@/store'

new Vue({
  router: $.router,
  i18n: $.i18n,
  store,
  render: h => h(App),
}).$mount('#app')

// @ts-ignore
window.appLoader.finish()
