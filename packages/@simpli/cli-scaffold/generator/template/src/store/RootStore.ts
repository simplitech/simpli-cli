import {ActionContext, ModuleTree, StoreOptions} from 'vuex'
import {getStoreAccessors} from 'vuex-typescript'
import Simpli, {Enum} from 'simpli-web-sdk'
import {RootState} from '@/types/store'
import {defaultCurrency, defaultLang} from '@/config/locale.config'
const app = require('../../package.json')

export type RootContext = ActionContext<RootState, RootState>

export class RootStore implements StoreOptions<RootState> {
  readonly accessors = getStoreAccessors<RootState, RootState>('')

  strict = process.env.NODE_ENV !== 'production'

  modules?: ModuleTree<RootState>

  state: RootState = {
    version: app.version,
    language: defaultLang,
    currency: defaultCurrency,
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
    setLang(context: RootContext, lang: Enum.Lang) {
      Simpli.changeLocale(lang)
      context.commit('SET_LANG', lang)
    },

    /**
     * Change app currency
     */
    setCurrency(context: RootContext, currency: Enum.Currency) {
      Simpli.changeCurrency(currency)
      context.commit('SET_CURRENCY', currency)
    },
  }

  mutations = {
    SET_LANG(state: RootState, lang: Enum.Lang) {
      state.language = lang
    },

    SET_CURRENCY(state: RootState, currency: Enum.Currency) {
      state.currency = currency
    },
  }
}
