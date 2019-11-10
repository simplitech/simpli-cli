import Vue from 'vue'
import Vuex, {Store} from 'vuex'
import {RootStore} from '@/store/RootStore'
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
import {AuthModule} from '@/store/modules/AuthModule'
<%_ } _%>

Vue.use(Vuex)

export const root = new RootStore()
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
export const auth = new AuthModule()
<%_ } _%>

root.modules = {
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
  auth,
<%_ } _%>
}

export const store = new Store(root)
