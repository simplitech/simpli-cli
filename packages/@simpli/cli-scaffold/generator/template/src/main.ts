import Vue from 'vue'
import App from './App.vue'

import '@/bootstrap/app'
import '@/bootstrap/vendor'

import {$} from '@/simpli'
import {store} from '@/store'

Vue.config.productionTip = false

<%_ console.log(rootOptions) _%>
<%_ console.log(options.swaggerSetup) _%>

new Vue({
  router: $.router,
  i18n: $.i18n,
  store,
  render: (h) => h(App),
}).$mount('#app')
