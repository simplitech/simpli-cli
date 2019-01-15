<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
import {store} from '@/store'
<%_ var loginHolderModel = rootOptions.scaffoldSetup.auth.model.loginHolder _%>
<%-loginHolderModel.injectIntoDependence().build()%>

export const isLogged = () => store.getters['auth/isLogged']
<%-rootOptions.scaffoldSetup.auth.buildExport()-%>
export const auth = () => store.dispatch('auth/auth')
export const signIn = (request: <%-loginHolderModel.name%>) => store.dispatch('auth/signIn', request)
export const signOut = () => store.dispatch('auth/signOut')
<%_ } _%>
