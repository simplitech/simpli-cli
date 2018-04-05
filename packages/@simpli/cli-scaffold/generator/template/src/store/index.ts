import Vue from 'vue'
import Vuex, {StoreOptions} from 'vuex'
import {RootState} from '@/types/store'
import {actions, getters, mutations, state} from '@/store/root'
import {auth} from '@/store/modules/auth'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const setup: StoreOptions<RootState> = {
  state, // root state
  getters, // root getters
  actions, // root actions
  mutations, // root mutations
  modules: {
    auth,
  },
  strict: debug,
}

export const store = new Vuex.Store<RootState>(setup)
