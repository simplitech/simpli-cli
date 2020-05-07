<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
import {auth, store} from '@/store'
import {AccessorWrapper} from '@simpli/vuex-typescript'
import {AuthState, RootState} from '@/types/store'
<%_ var auth = rootOptions.scaffoldSetup.auth _%>
<%_ var loginHolderModel = auth.model.loginHolder _%>
<%-loginHolderModel.injectIntoDependence().build()%>

export const wrapper = new AccessorWrapper<AuthState, RootState>('auth')

export abstract class Auth {
  static $accessors = wrapper.accessors

  static get isLogged() {
    return Auth.$accessors.read(auth.getters.isLogged)(store)
  }

<%-rootOptions.scaffoldSetup.auth.buildExport()-%>
  static get cachePath() {
    return Auth.$accessors.read(auth.getters.cachePath)(store)
  }

  static signIn(request: <%-loginHolderModel.name%>) {
    return Auth.$accessors.dispatch(auth.actions.signIn)(store, request)
  }

  static authenticate() {
    return Auth.$accessors.dispatch(auth.actions.authenticate)(store)
  }

  static signOut() {
    return Auth.$accessors.dispatch(auth.actions.signOut)(store)
  }

  static populateToken() {
    return Auth.$accessors.commit(auth.mutations.POPULATE_TOKEN)(store)
  }
}
<%_ } _%>
