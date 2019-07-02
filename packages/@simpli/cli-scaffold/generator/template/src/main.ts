import Vue from 'vue'
import App from './App.vue'

import '@/setup/app'
import '@/setup/settings'
import '@/setup/vendor'

import {$} from '@/simpli'
import {store} from '@/store'

new Vue({
  router: $.router,
  i18n: $.i18n,
  store,
  render: (h) => h(App),
}).$mount('#app')

// @ts-ignore
window.appLoader.finish()
