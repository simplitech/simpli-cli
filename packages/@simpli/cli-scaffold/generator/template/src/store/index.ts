import Vue from 'vue'
import Vuex, {StoreOptions} from 'vuex'
import {RootState} from '@/types/store'
import {actions, getters, mutations, state} from '@/store/root'
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
import {auth} from '@/store/modules/auth'
<%_ } _%>

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const setup: StoreOptions<RootState> = {
  state, // root state
  getters, // root getters
  actions, // root actions
  mutations, // root mutations
  modules: {
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
    auth,
<%_ } _%>
  },
  strict: debug,
}

export const store = new Vuex.Store<RootState>(setup)
