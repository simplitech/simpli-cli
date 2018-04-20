import {ActionTree, GetterTree, Module, MutationTree} from 'vuex'
import * as types from '@/store/mutation-types'
import {AuthState, RootState} from '@/types/store'
import {$, encrypt, push, successAndPush, errorAndPush, infoAndPush} from '@/simpli'
<%_ var userModel = rootOptions.scaffoldSetup.userModel _%>
<%_ var loginHolderModel = rootOptions.scaffoldSetup.loginHolderModel _%>
<%_ var loginRespModel = rootOptions.scaffoldSetup.loginRespModel _%>
<%_ var dependence1 = rootOptions.scaffoldSetup.injectIntoDependence(userModel) _%>
<%_ var dependence2 = rootOptions.scaffoldSetup.injectIntoDependence(loginHolderModel) _%>
<%_ var dependence3 = rootOptions.scaffoldSetup.injectIntoDependence(loginRespModel) _%>
<%_ rootOptions.scaffoldSetup.resolvePath(dependence1) _%>
<%_ rootOptions.scaffoldSetup.resolvePath(dependence2) _%>
<%_ rootOptions.scaffoldSetup.resolvePath(dependence3) _%>
<%-dependence1.build()%>
<%-dependence2.build()%>
<%-dependence3.build()%>
// import ForgotPasswordResp from '@/model/response/ForgotPasswordResp'
// import ChangePasswordWithHashResp from '@/model/response/ChangePasswordWithHashResp'

// initial state
const state: AuthState = {
  id: undefined,
  token: undefined,
  user: new <%-userModel%>(),
  unauthenticatedPath: undefined,
  eventListener: {
    signIn: [],
    auth: [],
    signOut: [],
  },
}

// getters
const getters: GetterTree<AuthState, RootState> = {
  isLogged: ({id, token, user}) => !!id && !!token,
  id: ({id}) => id,
  token: ({token}) => token,
  user: ({user}) => user,
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
  signIn: async ({state, commit, getters}, model: <%-loginHolderModel%>) => {
    const loginResp: <%-loginRespModel%> = new <%-loginRespModel%>()
    model.password = encrypt(model.password)

    await model.validate()
    await loginResp.signIn(model)

    if (loginResp.id) localStorage.setItem('id', loginResp.id as string)
    if (loginResp.token) localStorage.setItem('token', loginResp.token)
    if (loginResp.user) localStorage.setItem('user', JSON.stringify(loginResp.user))

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
      const loginResp: <%-loginRespModel%> = new <%-loginRespModel%>()

      await loginResp.auth()

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
   * Forgot password
   * @param context
   * @param model
   */
  forgotPassword: async (context, model: <%-loginHolderModel%>) => {
    // const forgotPasswordResp = new ForgotPasswordResp(Number)
    // await forgotPasswordResp.forgotPassword(model)
    // successAndPush('system.success.forgotPasswordSuccess', '/login')
  },

  /**
   * Changes Password With Hash
   * @param context
   * @param model
   */
  changePasswordWithHash: async (context, model: <%-loginHolderModel%>) => {
    // const changePasswordWithHashResp = new ChangePasswordWithHashResp(Number)
    // await changePasswordWithHashResp.changePasswordWithHash(model)
    // successAndPush('system.success.changePasswordSuccess', '/login')
  },

  /**
   * Refresh user info
   * @param commit
   * @param data
   */
  refresh: ({commit}, data: <%-loginRespModel%>) => {
    if (data.id) localStorage.setItem('id', data.id as string)
    if (data.user) localStorage.setItem('user', JSON.stringify(data.user))
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
    const id = localStorage.getItem('id')!
    const token = localStorage.getItem('token')!
    const user = JSON.parse(localStorage.getItem('user')!)

    state.id = id
    state.token = token
    state.user = user
  },
  // Forget mutation
  [types.FORGET](state) {
    state.id = undefined
    state.token = undefined
    state.user = new <%-userModel%>()

    localStorage.removeItem('id')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
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
