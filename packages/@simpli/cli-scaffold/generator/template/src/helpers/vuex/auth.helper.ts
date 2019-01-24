<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
import {store} from '@/store'
<%_ var auth = rootOptions.scaffoldSetup.auth _%>
<%_ var loginHolderModel = auth.model.loginHolder _%>
<%-loginHolderModel.injectIntoDependence().build()%>
<%_ for (var i in auth.resolvedDependencies) { var dependence = auth.resolvedDependencies[i] _%>
<%-dependence.build()%>
<%_ } _%>
import {SocketConnection} from '@/simpli'

export const isLogged = () => store.getters['auth/isLogged'] as boolean
<%-rootOptions.scaffoldSetup.auth.buildExport()-%>
export const getNotification = () => store.getters['auth/notification'] as SocketConnection<String>

export const auth = () => store.dispatch('auth/auth')
export const signIn = (request: <%-loginHolderModel.name%>) => store.dispatch('auth/signIn', request)
export const signOut = () => store.dispatch('auth/signOut')
<%_ } _%>
