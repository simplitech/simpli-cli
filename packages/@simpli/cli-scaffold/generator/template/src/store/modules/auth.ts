<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
import {ActionTree, GetterTree, Module, MutationTree} from 'vuex'
import {AuthState, RootState} from '@/types/store'
import {$, Helper} from '@/simpli'
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

// initial state
const state: AuthState = {
<%-rootOptions.scaffoldSetup.auth.buildState()-%>
  cachePath: null,
  eventListener: {
    signIn: [],
    auth: [],
    signOut: [],
  },
}

// getters
const getters: GetterTree<AuthState, RootState> = {
  isLogged: ({token}) => !!token,
<%-rootOptions.scaffoldSetup.auth.buildGetter()-%>
  cachePath: ({cachePath}) => cachePath,
}

// actions
const actions: ActionTree<AuthState, RootState> = {
  /**
   * Sign in account
   * @param state
   * @param commit
   * @param getters
   * @param request
   * @param welcome
   */
  signIn: async ({state, commit, getters}, request: <%-loginHolderModel.name%>) => {
    const authResponse = await request.<%-signInApi.name%>()

<%-rootOptions.scaffoldSetup.auth.buildSetItem('loginResp')-%>

    commit('POPULATE_TOKEN')

    const uri = getters.cachePath && $.route.name !== 'signIn' ? getters.cachePath : '/dashboard'
    await Helper.infoAndPush('system.info.welcome', uri)

    commit('SET_CACHE_PATH', null)

    state.eventListener.signIn.forEach((item) => item(authResponse))
  },

  /**
   * Verifies authorization and refresh user info.
   * Note: If it is not logged then dispatches signOut
   * @param dispatch
   * @param commit
   * @param getters
   */
  auth: async ({dispatch, commit, getters}) => {
    commit('POPULATE_TOKEN')

    if (!getters.isLogged) {
      commit('SET_CACHE_PATH', $.route.path)

      Helper.error('system.error.unauthorized')
      dispatch('signOut')
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

    commit('POPULATE', authResponse)
    state.eventListener.auth.forEach((item) => item(authResponse))
  },

  /**
   * Sign out account
   * @param state
   * @param commit
   * @param showError
   */
  signOut: ({state, commit}) => {
    Helper.push('/sign-in')

    // TODO: verify the need of a socket connection
    $.socket.disconnect('notification')

    commit('FORGET')
    state.eventListener.signOut.forEach((item) => item())
  },

<%_ if (recoverPasswordByMailRequestModel) { _%>
  /**
   * Reset password
   * @param context
   * @param request
   */
  resetPassword: async (context, request: <%-recoverPasswordByMailRequestModel.name%>) => {
    await request.recoverPasswordByMail()
    Helper.successAndPush('system.success.recoverPasswordByMail', '/sign-in')
  },

<%_ } _%>
<%_ if (resetPasswordRequestModel) { _%>
  /**
   * Recover password
   * @param context
   * @param request
   */
  recoverPassword: async (context, request: <%-resetPasswordRequestModel.name%>) => {
    await request.resetPassword()
    Helper.successAndPush('system.success.resetPassword', '/sign-in')
  },

<%_ } _%>
<%_ if (changePasswordRequestModel) { _%>
  /**
   * Change password
   * @param context
   * @param request
   */
  changePassword: async ({dispatch, getters}, request: <%-changePasswordRequestModel.name%>) => {
    await request.changePassword()

    Helper.success('system.success.changePassword')

<%_ var userAttr = loginRespModel.objectAtrrs[0] _%>
    const authRequest = new <%-loginHolderModel.name%>()
<%_ if (userAttr) { _%>
    authRequest.<%-auth.accountAttrName%> = getters.<%-userAttr.name%>.<%-auth.accountAttrName%>
<%_ } _%>
    authRequest.<%-auth.passwordAttrName%> = request.newPassword

    dispatch('signIn', authRequest)
  },

<%_ } _%>
  /**
   * On SignIn Event
   * @param dispatch
   * @param callback
   */
  onSignIn: ({dispatch}, callback) => {
    dispatch('removeEventListener', {name: 'signIn'})
    dispatch('addEventListener', {name: 'signIn', callback})
  },

  /**
   * On Auth Event
   * @param dispatch
   * @param callback
   */
  onAuth: ({dispatch}, callback) => {
    dispatch('removeEventListener', {name: 'auth'})
    dispatch('addEventListener', {name: 'auth', callback})
  },

  /**
   * On SignOut Event
   * @param dispatch
   * @param callback
   */
  onSignOut: ({dispatch}, callback) => {
    dispatch('removeEventListener', {name: 'signOut'})
    dispatch('addEventListener', {name: 'signOut', callback})
  },

  /**
   * Add event listener
   * @param commit
   * @param payload {name, callback}
   */
  addEventListener: ({commit}, payload) => commit('ADD_EVENT_LISTENER', payload),

  /**
   * Remove event listener
   * @param commit
   * @param payload
   */
  removeEventListener: ({commit}, payload) => commit('REMOVE_EVENT_LISTENER', payload),
}

// mutations
const mutations: MutationTree<AuthState> = {
  // Populate token mutation
  POPULATE_TOKEN(state) {
    state.token = localStorage.getItem('token') ?? null
  },

  // Populate user mutation
  POPULATE(state, response: <%-loginRespModel.name%>) {
<%-rootOptions.scaffoldSetup.auth.buildPopulate()-%>
  },

  // Forget mutation
  FORGET(state) {
<%-rootOptions.scaffoldSetup.auth.buildForget()-%>

    localStorage.removeItem('token')
  },

  // Set Cache Path mutation
  SET_CACHE_PATH(state, val) {
    state.cachePath = val
  },

  // Add Event Listener mutation
  ADD_EVENT_LISTENER(state, {name, callback}) {
    state.eventListener[name].push(callback)
  },

  // Remove Event Listener mutation
  REMOVE_EVENT_LISTENER(state, {name, callback}) {
    if (callback) {
      const index = state.eventListener[name].findIndex((item) => item === callback)
      state.eventListener[name].splice(index, 1)
    } else {
      state.eventListener[name] = []
    }
  },
}

const namespaced: boolean = true
export const auth: Module<AuthState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
}
<%_ } _%>
