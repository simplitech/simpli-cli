import {ActionTree, GetterTree, Module, MutationTree} from 'vuex'
import * as types from '@/store/mutation-types'
import {AuthState, RootState} from '@/types/store'
import LoginHolder from '@/app/params/LoginHolder'
import {uri, push, route, successAndPush, errorAndPush, infoAndPush} from '@/helpers'
import LoginResp from '@/model/response/LoginResp'
import User from '@/model/User'
import ForgotPasswordResp from '@/model/response/ForgotPasswordResp'
import ChangePasswordWithHashResp from '@/model/response/ChangePasswordWithHashResp'

// initial state
const state: AuthState = {
  id: undefined,
  token: undefined,
  user: new User(),
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
  signIn: async ({state, commit, getters}, model: LoginHolder) => {
    const loginResp: LoginResp = new LoginResp()

    await model.validate()
    await loginResp.signIn(model)

    if (loginResp.id) localStorage.setItem('id', loginResp.id as string)
    if (loginResp.token) localStorage.setItem('token', loginResp.token)
    if (loginResp.user) localStorage.setItem('user', JSON.stringify(loginResp.user))

    commit(types.POPULATE)

    if (getters!.unauthenticatedPath && route.path !== uri.login) {
      infoAndPush('system.info.welcome', getters!.unauthenticatedPath)
    } else {
      infoAndPush('system.info.welcome', uri.dashboard)
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
      const loginResp: LoginResp = new LoginResp()

      await loginResp.auth()

      dispatch('refresh', loginResp)
      state.eventListener.auth.forEach((item) => item(loginResp))
    } else {
      commit(types.SET_UNAUTHENTICATED_PATH, route.path)
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
    if (showError) errorAndPush('system.error.unauthorized', uri.login)
    else push(uri.login)

    commit(types.FORGET)
    state.eventListener.signOut.forEach((item) => item())
  },

  /**
   * Forgot password
   * @param context
   * @param model
   */
  forgotPassword: async (context, model: LoginHolder) => {
    const forgotPasswordResp: ForgotPasswordResp = new ForgotPasswordResp(Number)

    await forgotPasswordResp.forgotPassword(model)

    successAndPush('system.success.forgotPasswordSuccess', uri.login)
  },

  /**
   * Changes Password With Hash
   * @param context
   * @param model
   */
  changePasswordWithHash: async (context, model: LoginHolder) => {
    const changePasswordWithHashResp: ChangePasswordWithHashResp = new ChangePasswordWithHashResp(Number)

    await changePasswordWithHashResp.changePasswordWithHash(model)

    successAndPush('system.success.changePasswordSuccess', uri.login)
  },

  /**
   * Refresh user info
   * @param commit
   * @param data
   */
  refresh: ({commit}, data: LoginResp) => {
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
    state.user = new User()

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