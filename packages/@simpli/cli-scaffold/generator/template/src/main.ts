import Vue from 'vue'
import App from './App.vue'

import '@/bootstrap/app'
import '@/bootstrap/settings'
import '@/bootstrap/vendor'

import {$} from '@/simpli'
import {store} from '@/store'

new Vue({
  router: $.router,
  i18n: $.i18n,
  store,
  render: (h) => h(App),
}).$mount('#app')
