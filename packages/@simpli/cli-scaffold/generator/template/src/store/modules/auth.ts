<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
import {ActionTree, GetterTree, Module, MutationTree} from 'vuex'
import * as types from '@/store/mutation-types'
import {AuthState, RootState} from '@/types/store'
import {$, push, successAndPush, errorAndPush, infoAndPush} from '@/simpli'
<%_ var auth = rootOptions.scaffoldSetup.auth _%>
<%_ var signInApi = auth.api.signIn _%>
<%_ var authApi = auth.api.auth _%>
<%_ var loginHolderModel = auth.model.loginHolder _%>
<%_ var loginRespModel = auth.model.loginResp _%>
<%-loginHolderModel.injectIntoDependence().build()%>
<%-loginRespModel.injectIntoDependence().build()%>
<%_ for (var i in auth.resolvedDependencies) { var dependence = auth.resolvedDependencies[i] _%>
<%-dependence.build()%>
<%_ } _%>

// initial state
const state: AuthState = {
<%-rootOptions.scaffoldSetup.auth.buildState()-%>
  unauthenticatedPath: undefined,
  eventListener: {
    signIn: [],
    auth: [],
    signOut: [],
  },
}

// getters
const getters: GetterTree<AuthState, RootState> = {
  isLogged: ({id, token}) => !!id && !!token,
<%-rootOptions.scaffoldSetup.auth.buildGetter()-%>
  unauthenticatedPath: ({unauthenticatedPath}) => unauthenticatedPath,
}

// actions
const actions: ActionTree<AuthState, RootState> = {
  /**
   * Sign in account
   * @param state
   * @param commit
   * @param getters
   * @param model format => model: { account, password } (non-encrypted)
   */
  signIn: async ({state, commit, getters}, model: <%-loginHolderModel.name%>) => {
    const loginResp = new <%-loginRespModel.name%>()

    await loginResp.<%-signInApi.name%>(model)

<%-rootOptions.scaffoldSetup.auth.buildSetItem('loginResp')-%>

    commit(types.POPULATE)

    if (getters!.unauthenticatedPath && $.route.name !== 'login') {
      infoAndPush('system.info.welcome', getters!.unauthenticatedPath)
    } else {
      infoAndPush('system.info.welcome', '/dashboard')
    }
    commit(types.SET_UNAUTHENTICATED_PATH, undefined)

    state.eventListener.signIn.forEach((item) => item(loginResp))
  },

  /**
   * Verifies authorization and refresh user info.
   * Note: If it is not logged then dispatches signOut
   * @param dispatch
   * @param commit
   * @param getters
   */
  auth: async ({dispatch, commit, getters}) => {
    commit(types.POPULATE)

    if (getters.isLogged) {
      const loginResp = new <%-loginRespModel.name%>()

      await loginResp.<%-authApi.name%>()

      dispatch('refresh', loginResp)
      state.eventListener.auth.forEach((item) => item(loginResp))
    } else {
      commit(types.SET_UNAUTHENTICATED_PATH, $.route.path)
      dispatch('signOut', true)
    }
  },

  /**
   * Sign out account
   * @param state
   * @param commit
   * @param showError
   */
  signOut: ({state, commit}, showError: boolean = false) => {
    if (showError) errorAndPush('system.error.unauthorized', '/login')
    else push('/login')

    commit(types.FORGET)
    state.eventListener.signOut.forEach((item) => item())
  },

  /**
   * Reset password
   * @param context
   * @param model
   */
  resetPassword: async (context, model: <%-loginHolderModel.name%>) => {
<%_ if (loginRespModel.hasResetPassword) { _%>
    await new <%-loginRespModel.name%>(Number).resetPassword(model)
    successAndPush('system.success.resetPassword', '/login')
<%_ } else { _%>
      /**/
<%_ } _%>
  },

  /**
   * Recover password
   * @param context
   * @param model
   */
  recoverPassword: async (context, model: <%-loginHolderModel.name%>) => {
<%_ if (loginRespModel.hasRecoverPassword) { _%>
    await new <%-loginRespModel.name%>(String).recoverPassword(model)
    successAndPush('system.success.recoverPassword', '/login')
<%_ } else { _%>
    /**/
<%_ } _%>
  },

  /**
   * Refresh user info
   * @param commit
   * @param data
   */
  refresh: ({commit}, data: <%-loginRespModel.name%>) => {
<%-rootOptions.scaffoldSetup.auth.buildSetItem('data')-%>

    commit(types.POPULATE)
  },

  /**
   * On SignIn Event
   * @param dispatch
   * @param callback
   */
  onSignIn: ({dispatch}, callback) => dispatch('addEventListener', {name: 'signIn', callback}),

  /**
   * On Auth Event
   * @param dispatch
   * @param callback
   */
  onAuth: ({dispatch}, callback) => dispatch('addEventListener', {name: 'auth', callback}),

  /**
   * On SignOut Event
   * @param dispatch
   * @param callback
   */
  onSignOut: ({dispatch}, callback) => dispatch('addEventListener', {name: 'signOut', callback}),

  /**
   * Add event listener
   * @param commit
   * @param payload {name, callback}
   */
  addEventListener: ({commit}, payload) => commit(types.ADD_EVENT_LISTENER, payload),

  /**
   * Remove event listener
   * @param commit
   * @param payload
   */
  removeEventListener: ({commit}, payload) => commit(types.REMOVE_EVENT_LISTENER, payload),
}

// mutations
const mutations: MutationTree<AuthState> = {
  // Populate mutation
  [types.POPULATE](state) {
<%-rootOptions.scaffoldSetup.auth.buildGetItem()-%>

<%-rootOptions.scaffoldSetup.auth.buildPopulate()-%>
  },
  // Forget mutation
  [types.FORGET](state) {
<%-rootOptions.scaffoldSetup.auth.buildForget()-%>

<%-rootOptions.scaffoldSetup.auth.buildRemoveItem()-%>
  },
  // Set UnauthenticatedPath mutation
  [types.SET_UNAUTHENTICATED_PATH](state, val) {
    state.unauthenticatedPath = val
  },
  // Add Event Listener mutation
  [types.ADD_EVENT_LISTENER](state, {name, callback}) {
    state.eventListener[name].push(callback)
  },
  // Remove Event Listener mutation
  [types.REMOVE_EVENT_LISTENER](state, {name, callback}) {
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
