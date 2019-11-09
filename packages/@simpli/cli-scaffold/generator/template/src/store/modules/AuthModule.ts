<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
import {ActionTree, GetterTree, Module, MutationTree} from 'vuex'
import {AuthState, RootState} from '@/types/store'
import {$, Helper} from 'simpli-web-sdk'
<%_ var auth = rootOptions.scaffoldSetup.auth _%>
<%_ var signInApi = auth.api.signIn _%>
<%_ var authApi = auth.api.auth _%>
<%_ var loginHolderModel = auth.model.loginHolder _%>
<%_ var loginRespModel = auth.model.loginResp _%>
<%_ var recoverPasswordByMailRequestModel = auth.model.recoverPasswordByMailRequest _%>
<%_ var resetPasswordRequestModel = auth.model.resetPasswordRequest _%>
<%_ var changePasswordRequestModel = auth.model.changePasswordRequest _%>
<%-loginHolderModel.injectIntoDependence().build()%>
<%-loginRespModel.injectIntoDependence().build()%>
<%_ if (recoverPasswordByMailRequestModel) { _%>
<%-recoverPasswordByMailRequestModel.injectIntoDependence().build()%>
<%_ } _%>
<%_ if (resetPasswordRequestModel) { _%>
<%-resetPasswordRequestModel.injectIntoDependence().build()%>
<%_ } _%>
<%_ if (changePasswordRequestModel) { _%>
<%-changePasswordRequestModel.injectIntoDependence().build()%>
<%_ } _%>

export class AuthModule implements Module<AuthState, RootState> {
  namespaced = true

  state: AuthState = {
<%-rootOptions.scaffoldSetup.auth.buildState()-%>
    cachePath: null,
    eventListener: {
      signIn: [],
      auth: [],
      signOut: [],
    },
  }

  getters: GetterTree<AuthState, RootState> = {
    isLogged: ({token}) => !!token,
<%-rootOptions.scaffoldSetup.auth.buildGetter()-%>
    cachePath: ({cachePath}) => cachePath,
  }

  actions: ActionTree<AuthState, RootState> = {
    /**
     * Sign in account
     */
    signIn: async (context, request: <%-loginHolderModel.name%>) => {
      const authResponse = await request.<%-signInApi.name%>()

<%-rootOptions.scaffoldSetup.auth.buildSetItem('loginResp')-%>

      context.commit('POPULATE_TOKEN')

      const uri = context.getters.cachePath && $.route.name !== 'signIn' ? context.getters.cachePath : '/dashboard'
      await Helper.infoAndPush('system.info.welcome', uri)

      context.commit('SET_CACHE_PATH', null)

      context.state.eventListener.signIn.forEach((item) => item(authResponse))
    },

    /**
     * Verifies authorization and refresh user info.
     */
    auth: async (context) => {
      context.commit('POPULATE_TOKEN')

      if (!context.getters.isLogged) {
        context.commit('SET_CACHE_PATH', $.route.path)

        Helper.error('system.error.unauthorized')
        await context.dispatch('signOut')
        return
      }

      const authResponse = await <%-loginHolderModel.name%>.<%-authApi.name%>()

<%-rootOptions.scaffoldSetup.auth.buildPopulateIdAndToken()-%>

      // TODO: verify the need of a socket connection
      const connection = $.socket.connect<string>('notification', `/<%-signInApi.moduleName%>/notification/${token}`)

      connection.onOpen(() => console.info(`Socket connection with client id=${id} established`))
      connection.onClose(() => console.info(`Socket connection with client id=${id} lost`))
      connection.onError(() => console.error(`Error with socket connection(client id=${id})`))
      connection.onData((resp) => $.snotify.info(resp as string))

      context.commit('POPULATE', authResponse)
      context.state.eventListener.auth.forEach((item) => item(authResponse))
    },

    /**
     * Sign out account
     */
    signOut: async (context) => {
      await Helper.push('/sign-in')

      // TODO: verify the need of a socket connection
      $.socket.disconnect('notification')

      context.commit('FORGET')
      context.state.eventListener.signOut.forEach((item) => item())
    },

<%_ if (recoverPasswordByMailRequestModel) { _%>
    /**
     * Reset password
     */
    resetPassword: async (context, request: <%-recoverPasswordByMailRequestModel.name%>) => {
      await request.recoverPasswordByMail()
      await Helper.successAndPush('system.success.resetPassword', '/sign-in')
    },

<%_ } _%>
<%_ if (resetPasswordRequestModel) { _%>
    /**
     * Recover password
     */
    recoverPassword: async (context, request: <%-resetPasswordRequestModel.name%>) => {
      await request.resetPassword()
      await Helper.successAndPush('system.success.recoverPassword', '/sign-in')
    },

<%_ } _%>
<%_ if (changePasswordRequestModel) { _%>
    /**
     * Change password
     */
    changePassword: async (context, request: <%-changePasswordRequestModel.name%>) => {
      await request.changePassword()

      Helper.success('system.success.changePassword')

<%_ var userAttr = loginRespModel.objectAtrrs[0] _%>
      const authRequest = new <%-loginHolderModel.name%>()
<%_ if (userAttr) { _%>
      authRequest.<%-auth.accountAttrName%> = context.getters.<%-userAttr.name%>.<%-auth.accountAttrName%>
<%_ } _%>
      authRequest.<%-auth.passwordAttrName%> = request.newPassword

      await context.dispatch('signIn', authRequest)
    },

<%_ } _%>
    /**
     * On SignIn Event
     */
    onSignIn: async (context, callback) => {
      await context.dispatch('removeEventListener', {name: 'signIn'})
      await context.dispatch('addEventListener', {name: 'signIn', callback})
    },

    /**
     * On Auth Event
     */
    onAuth: async (context, callback) => {
      await context.dispatch('removeEventListener', {name: 'auth'})
      await context.dispatch('addEventListener', {name: 'auth', callback})
    },

    /**
     * On SignOut Event
     */
    onSignOut: async (context, callback) => {
      await context.dispatch('removeEventListener', {name: 'signOut'})
      await context.dispatch('addEventListener', {name: 'signOut', callback})
    },

    /**
     * Add event listener
     */
    addEventListener: (context, payload) => context.commit('ADD_EVENT_LISTENER', payload),

    /**
     * Remove event listener
     */
    removeEventListener: (context, payload) => context.commit('REMOVE_EVENT_LISTENER', payload),
  }

  mutations: MutationTree<AuthState> = {
    POPULATE_TOKEN(state) {
      state.token = localStorage.getItem('token') ?? null
    },

    POPULATE(state, response: <%-loginRespModel.name%>) {
<%-rootOptions.scaffoldSetup.auth.buildPopulate()-%>
    },

    FORGET(state) {
<%-rootOptions.scaffoldSetup.auth.buildForget()-%>

      localStorage.removeItem('token')
    },

    SET_CACHE_PATH(state, val) {
      state.cachePath = val
    },

    ADD_EVENT_LISTENER(state, {name, callback}) {
      state.eventListener[name].push(callback)
    },

    REMOVE_EVENT_LISTENER(state, {name, callback}) {
      if (callback) {
        const index = state.eventListener[name].findIndex((item) => item === callback)
        state.eventListener[name].splice(index, 1)
      } else {
        state.eventListener[name] = []
      }
    },
  }
}
<%_ } _%>
