<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
import {auth, store} from '@/store'
<%_ var auth = rootOptions.scaffoldSetup.auth _%>
<%_ var loginHolderModel = auth.model.loginHolder _%>
<%-loginHolderModel.injectIntoDependence().build()%>

const {read, dispatch, commit} = auth.accessors
const {getters, actions, mutations} = auth

export abstract class Auth {
  static get isLogged() {
    return read(getters.isLogged)(store)
  }

<%-rootOptions.scaffoldSetup.auth.buildExport()-%>
  static get cachePath() {
    return read(getters.cachePath)(store)
  }

  static signIn(request: <%-loginHolderModel.name%>) {
    return dispatch(actions.signIn)(store, request)
  }

  static authenticate() {
    return dispatch(actions.authenticate)(store)
  }

  static signOut() {
    return dispatch(actions.signOut)(store)
  }

  static populateToken() {
    return commit(mutations.POPULATE_TOKEN)(store)
  }
}
<%_ } _%>
