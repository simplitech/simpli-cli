import Vue from 'vue'
import Vuex, {Store} from 'vuex'
import {RootStore} from '@/store/RootStore'

Vue.use(Vuex)

const root = new RootStore()
export const store = new Store(root)
