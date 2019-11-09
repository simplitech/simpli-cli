import {ActionTree, GetterTree, ModuleTree, MutationTree, StoreOptions} from 'vuex'
import Simpli, {Enum} from 'simpli-web-sdk'
import {RootState} from '@/types/store'
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
import {AuthModule} from '@/store/modules/AuthModule'
<%_ } _%>
import {defaultCurrency, defaultLang} from '@/config/locale.config'
const app = require('../../package.json')

export class RootStore implements StoreOptions<RootState> {
  strict = process.env.NODE_ENV !== 'production'

  modules: ModuleTree<RootState> = {
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
    auth: new AuthModule(),
<%_ } _%>
  }

  state: RootState = {
    version: app.version,
    language: defaultLang,
    currency: defaultCurrency,
  }

  getters: GetterTree<RootState, RootState> = {
    version: ({version}) => version,
    language: ({language}) => language,
    currency: ({currency}) => currency,
  }

  actions: ActionTree<RootState, RootState> = {
    /**
     * Change app language
     */
    setLang: (context, val: Enum.Lang) => {
      Simpli.changeLocale(val)
      context.commit('SET_LANG', val)
    },

    /**
     * Change app currency
     */
    setCurrency: (context, val: Enum.Currency) => {
      Simpli.changeCurrency(val)
      context.commit('SET_CURRENCY', val)
    },
  }

  mutations: MutationTree<RootState> = {
    SET_LANG(state, val) {
      state.language = val
    },

    SET_CURRENCY(state, val) {
      state.currency = val
    },
  }
}
