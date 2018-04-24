import {store} from '@/store'
<%_ var loginHolderModel = rootOptions.scaffoldSetup.auth.model.loginHolder _%>
<%-loginHolderModel.injectIntoDependence().build()%>

export const isLogged = () => store.getters['auth/isLogged']
<%-rootOptions.scaffoldSetup.auth.buildExport()-%>
export const auth = () => store.dispatch('auth/auth')
export const signIn = (model: <%-loginHolderModel.name%>) => store.dispatch('auth/signIn', model)
export const signOut = () => store.dispatch('auth/signOut', false)
export const signOutWithError = () => store.dispatch('auth/signOut', true)
