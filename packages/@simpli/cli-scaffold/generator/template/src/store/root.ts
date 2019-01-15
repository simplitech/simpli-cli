import {ActionTree, GetterTree, MutationTree} from 'vuex'
import {$, Lang, Currency} from '@/simpli'
import {RootState} from '@/types/store'
import {defaultCurrency, defaultLang} from '@/config/locale.config'
const app = require('../../package.json')

// initial root state
export const state: RootState = {
  version: app.version,
  language: defaultLang,
  currency: defaultCurrency,
}

// root getters
export const getters: GetterTree<RootState, RootState> = {
  version: ({version}) => version,
  language: ({language}) => language,
  currency: ({currency}) => currency,
}

// root actions
export const actions: ActionTree<RootState, RootState> = {
  /**
   * Change app language
   * @param commit
   * @param val
   */
  setLang: ({commit}, val: Lang) => {
    $.i18n.locale = val
    commit('SET_LANG', val)
  },

  /**
   * Change app currency
   * @param commit
   * @param val
   */
  setCurrency: ({commit}, val: Currency) => {
    commit('SET_CURRENCY', val)
  },
}

// root mutations
export const mutations: MutationTree<RootState> = {
  // Set Lang mutation
  SET_LANG(state, val) {
    state.language = val
  },
  // Set Currency mutation
  SET_CURRENCY(state, val) {
    state.currency = val
  },
}
