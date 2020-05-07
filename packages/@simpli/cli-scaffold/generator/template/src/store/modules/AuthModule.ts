<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
import {ActionContext, Module} from 'vuex'
import {AccessorHandler} from '@simpli/vuex-typescript'
import {$} from '@/facade'
import {AuthState, RootState} from '@/types/store'
<%_ var auth = rootOptions.scaffoldSetup.auth _%>
<%_ var signInApi = auth.api.signIn _%>
<%_ var authApi = auth.api.auth _%>
<%_ var loginHolderModel = auth.model.loginHolder _%>
<%_ var loginRespModel = auth.model.loginResp _%>
<%-loginHolderModel.injectIntoDependence().build()%>
<%-loginRespModel.injectIntoDependence().build()%>

export type AuthContext = ActionContext<AuthState, RootState>

@AccessorHandler
export class AuthModule implements Module<AuthState, RootState> {
  namespaced = true

  state: AuthState = {
<%-rootOptions.scaffoldSetup.auth.buildState()-%>
    cachePath: null,
  }

  getters = {
    isLogged: (state: AuthState) => Boolean(state.token),
<%-rootOptions.scaffoldSetup.auth.buildGetter()-%>
    cachePath: (state: AuthState) => state.cachePath,
  }

  actions = {
    /**
     * Sign in account
     */
    async signIn(context: AuthContext, request: <%-loginHolderModel.name%>) {
      const authResponse = await request.<%-signInApi.name%>()

<%-rootOptions.scaffoldSetup.auth.buildSetItem('loginResp')-%>

      context.commit('POPULATE_TOKEN')
      context.commit('POPULATE', authResponse)

      const uri =
        context.getters.cachePath && $.route.name !== 'signIn'
          ? context.getters.cachePath
          : '/dashboard'

      $.toast.info('system.info.welcome')
      await $.nav.push(uri)

      context.commit('SET_CACHE_PATH', null)

      return authResponse
    },

    /**
     * Verifies authorization and refresh user info.
     */
    async authenticate(context: AuthContext) {
      context.commit('POPULATE_TOKEN')

      if (!context.getters.isLogged) {
        context.commit('SET_CACHE_PATH', $.route.path)

        await context.dispatch('signOut')
        $.toast.abort('system.error.unauthorized')
      }

      const authResponse = await <%-loginHolderModel.name%>.<%-authApi.name%>()

<%-rootOptions.scaffoldSetup.auth.buildPopulateIdAndToken()-%>

      // TODO: verify the need of a socket connection
      const connection = $.socket.connect<string>(
        'notification',
        `/<%-signInApi.moduleName%>/notification/${token}`
      )

      connection.onOpen(() =>
        console.info(`Socket connection with client id=${id} established`)
      )
      connection.onClose(() =>
        console.info(`Socket connection with client id=${id} lost`)
      )
      connection.onError(() =>
        console.error(`Error with socket connection(client id=${id})`)
      )
      connection.onData(resp => $.snotify.info(resp as string))

      context.commit('POPULATE', authResponse)

      return authResponse
    },

    /**
     * Sign out account
     */
    async signOut(context: AuthContext) {
      await $.nav.push('/sign-in')

      // TODO: verify the need of a socket connection
      $.socket.disconnect('notification')

      context.commit('FORGET')
    },
  }

  mutations = {
    POPULATE_TOKEN(state: AuthState) {
      state.token = localStorage.getItem('token') ?? null
    },

    POPULATE(state: AuthState, response: <%-loginRespModel.name%>) {
<%-rootOptions.scaffoldSetup.auth.buildPopulate()-%>
    },

    FORGET(state: AuthState) {
<%-rootOptions.scaffoldSetup.auth.buildForget()-%>

      localStorage.removeItem('token')
    },

    SET_CACHE_PATH(state: AuthState, cachePath: string | null) {
      state.cachePath = cachePath
    },
  }
}
<%_ } _%>
