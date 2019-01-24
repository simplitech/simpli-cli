/**
 * @file
 * Http Request Configuration
 * Used in library: vue-resource
 *
 * This file provides the standard configuration to communicate with the server
 * See https://github.com/pagekit/vue-resource/blob/develop/docs/http.md#interceptors
 * This configuration will be set in @/bootstrap/app.ts
 */

import VueResource from 'vue-resource'
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
import {$, getToken, getVersion, getLanguage, isLogged, signOut, HttpStatus, error} from '@/simpli'
<%_ } else { _%>
import {$, getVersion, getLanguage, HttpStatus, error} from '@/simpli'
<%_ } _%>

/**
 * Base URL of the server API
 * @type {string}
 */
export const apiURL = process.env.VUE_APP_API_URL || 'http://localhost/api'

/**
 * Base URL of the Socket server
 * @type {string}
 */
export const socketURL = process.env.VUE_APP_SOCKET_URL || 'ws://localhost/ws'

/**
 * Standard behavior during a request
 * @param {VueResource.HttpOptions} request
 * @param {Function} next
 */
export const httpInterceptor = (request: VueResource.HttpOptions, next: any) => {
  const regex = new RegExp(`^${apiURL}\\S*$`, 'g')
  const match = regex.exec(request.url || '')

  if (match) {
    request.headers.set('Accept-Language', getLanguage())
    request.headers.set('X-Client-Version', `w${getVersion()}`) // w = web
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>

    if (isLogged()) request.headers.set('Authorization', `Bearer ${getToken()}`)
<%_ } _%>
  }

  next((resp: VueResource.HttpResponse) => {
    if (!resp.status) error('system.error.noServer')
    else if (resp.status >= 400) {
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
      if (resp.status === HttpStatus.UNAUTHORIZED) signOut()

<%_ } _%>
      $.snotify.error(resp.data.message || resp.statusText, resp.status.toString())
    }
  })
}
