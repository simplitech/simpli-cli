import {ActionContext, ModuleTree, StoreOptions} from 'vuex'
import {AccessorHandler} from '@simpli/vuex-typescript'
import {Setup} from '@/app/Setup'
import {RootState} from '@/types/store'
import {Lang} from '@/enums/Lang'
import {Currency} from '@/enums/Currency'

const app = require('../../package.json')

export type RootContext = ActionContext<RootState, RootState>

@AccessorHandler
export class RootStore implements StoreOptions<RootState> {
  strict = process.env.NODE_ENV !== 'production'

  modules?: ModuleTree<RootState>

  state: RootState = {
    version: app.version,
    language: null,
    currency: null,
  }

  getters = {
    version: (state: RootState) => state.version,
    language: (state: RootState) => state.language,
    currency: (state: RootState) => state.currency,
  }

  actions = {
    /**
     * Change app language
     */
    setLanguage(context: RootContext, lang: Lang | null) {
      if (lang) Setup.changeLocale(lang)
      context.commit('SET_LANGUAGE', lang)
    },

    /**
     * Change app currency
     */
    setCurrency(context: RootContext, currency: Currency | null) {
      if (currency) Setup.changeCurrency(currency)
      context.commit('SET_CURRENCY', currency)
    },
  }

  mutations = {
    SET_LANGUAGE(state: RootState, val: Lang) {
      state.language = val
    },

    SET_CURRENCY(state: RootState, val: Currency) {
      state.currency = val
    },
  }
}
