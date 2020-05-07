import Vue from 'vue'
import {root, store} from '@/store'
import {AccessorWrapper} from '@simpli/vuex-typescript'
import {RootState} from '@/types/store'

export const wrapper = new AccessorWrapper<RootState, RootState>()

export abstract class App {
  static $accessors = wrapper.accessors

  static readonly event = new Vue()

  static get version() {
    return App.$accessors.read(root.getters.version)(store)
  }

  static get language() {
    return App.$accessors.read(root.getters.language)(store)
  }
  static set language(val) {
    App.$accessors.dispatch(root.actions.setLanguage)(store, val)
  }

  static get currency() {
    return App.$accessors.read(root.getters.currency)(store)
  }
  static set currency(val) {
    App.$accessors.dispatch(root.actions.setCurrency)(store, val)
  }
}
